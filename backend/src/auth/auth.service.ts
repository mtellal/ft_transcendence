import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common"
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { Profile } from 'passport-42';
import * as generator from 'generate-password';
import axios from 'axios';
import { join } from 'path';
import { createWriteStream } from 'fs';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';
 

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	async signup(dto: AuthDto) {
		const hash = await argon.hash(dto.password);

		try {
			const user = await this.prisma.user.create({
				data: {
					username: dto.username,
					password: hash,
				},
			});
			return this.signToken(user.id, user.username);
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Credentials taken');
			}
			throw error;
		}
	}

	async signin(username: string, password: string, code?: string) {
		const user = await this.prisma.user.findUnique({
			where: { username: username},
		})
		if (!user) 
			throw new ForbiddenException('Credentials incorrect',);
		const pwMatches = await argon.verify(user.password, password);
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');
		if (user.twoFactorStatus) {
			const verified = speakeasy.totp.verify({
				secret: user.twoFactorSecret,
				encoding: 'base32',
				token: code,
				window: 1
			})
			console.log(code, verified);
			if (!verified) {
				return { step: '2fa', access_token: null };
			}
		}
		return { step: 'completed', access_token: (await this.signToken(user.id, user.username)).access_token };
	}

	async oauthLogIn(profile: Profile) {
		let index = 0;
		let username = profile.username;

		const user = await this.prisma.user.findUnique({
			where: { id: parseInt(profile.id) },
		})
		const { password, expirationTime } = await this.generateOneTimePassword();
		if (!user)
		{
			let userCheck = await this.prisma.user.findUnique({
				where: { username: username },
			})
			while (userCheck)
			{
				index++;
				username = `${profile.username}${index}`;

				userCheck = await this.prisma.user.findUnique({
					where: { username: username },
				})
			}
			const hash = await this.generateHash();
			console.log(profile);
			this.download42Pic(profile._json.image.link, profile.id + '.png');
			try {
			  const newuser = await this.prisma.user.create({
				  data: {
					id: parseInt(profile.id),
					username: username,
					password: hash,
					oauth_code: password,
					oauth_exp: expirationTime ? new Date(expirationTime) : null,
					avatar: './uploads/' + profile.id + '.png',
				  },
			  });
			  return newuser.oauth_code;
			}
			catch (error) {
			  if (error instanceof PrismaClientKnownRequestError) {
				  if (error.code === 'P2002')
					  throw new ForbiddenException('Credentials taken');
			  }
			  throw error;
			}
		}
		const updatedUser = await this.prisma.user.update({
			where: { id: user.id  },
			data: {
				oauth_code: password,
				oauth_exp: expirationTime ? new Date(expirationTime) : null,
			},
		});
		return updatedUser.oauth_code;
	}

	async generateHash() {
		const password = generator.generate({
			length: 12, // length of password
			numbers: true, // include numbers
			symbols: true, // include symbols
			uppercase: true, // include uppercase letters
			excludeSimilarCharacters: true // exclude similar characters
		  });
		const hash = await argon.hash(password);
		return hash;
	}

	async generateOneTimePassword() {
		const password = crypto.randomBytes(10).toString('hex');
		const expirationTime = Date.now() + 2 * 60 * 1000;
		return { password, expirationTime };
	}
	
	async oauthTrade(oauth_code: string, code?: string) {
		const user = await this.prisma.user.findUnique({
			where: { oauth_code: oauth_code },
		});
		if (!user) {
			throw new ForbiddenException('Credentials incorrect');
		}
		if (user.oauth_exp && Date.now() > user.oauth_exp.getTime()) {
			throw new ForbiddenException('Authentication code has expired');
		}
		if (user.twoFactorStatus) {
			const verified = speakeasy.totp.verify({
				secret: user.twoFactorSecret,
				encoding: 'base32',
				token: code,
				window: 1
			})
			console.log(code, verified);
			if (!verified) {
				throw new ForbiddenException('2FA incorrect');
			}
		}
		const updatedUser = await this.prisma.user.update({
			where: { id: user.id  },
			data: {
				oauth_code: null,
				oauth_exp: null,
			},
		});
		if (!updatedUser)
			throw new InternalServerErrorException('Failed to update user');
		return await this.signToken(user.id, user.username);
	}
	
	async signToken(userId: number, username: string): Promise< {access_token: string} > {
		const payload = {
			id: userId,
			username,
		}
		const secret = this.config.get('JWT_SECRET');
		const exp = this.config.get('EXPIRESIN');

		const token = await this.jwt.signAsync(
			payload,
			{
				// expiresIn: exp,
				secret: secret,
			},
		);

		return {
			access_token: token,
		};
	}

	async download42Pic(url: string, filename: string): Promise<void> {
		const response = await axios.get(url, { responseType: 'stream'});
		const path = join('./uploads', filename);
		const writer = createWriteStream(path);

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		})
	}

	async updateTwoFactorStatus(userId: number, enableTwoFactor: boolean) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user || user.twoFactorStatus === enableTwoFactor)
			throw new ForbiddenException('2FA update error');
		let updatedUser;
		if (enableTwoFactor === true) {
			const secret = speakeasy.generateSecret();
			const otpauthUrl = speakeasy.otpauthURL({
				secret: secret.base32,
				label: `ft_transcendence`,
			})
			updatedUser = await this.prisma.user.update({
				where: { id: user.id  },
				data: {
					twoFactorStatus: true,
					twoFactorSecret: secret.base32,
					twoFactorOtpUrl: otpauthUrl,
				},
			});
		}
		else {
			updatedUser = await this.prisma.user.update({
				where: { id: user.id },
				data: {
					twoFactorStatus: false,
					twoFactorSecret: null,
					twoFactorOtpUrl: null,
				},
			});
		}
		delete updatedUser.hash;
		delete updatedUser.twoFactorSecret;
		delete updatedUser.twoFactorOtpUrl;
		return updatedUser;
	}

	async generateQRcode(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user || !user.twoFactorStatus)
			throw new ForbiddenException('QRcode generation error');

		//Google Auth encoding
		const otpauthUrl = `otpauth://totp/${encodeURIComponent(user.username)}?secret=${encodeURIComponent(user.twoFactorSecret)}&issuer=ft_transcendence`;

		try {
			const qrCodeImageBuffer = await qrcode.toDataURL(otpauthUrl);
			return qrCodeImageBuffer;
		} catch (error) {
			throw new ForbiddenException('QR code generation error');
		}
	}
}
