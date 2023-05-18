import { ForbiddenException, Injectable } from "@nestjs/common"
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


@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService) {}

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

	async signin(username: string, password: string) {
		const user = await this.prisma.user.findUnique({
			where: { username: username},
		})
		if (!user) 
			throw new ForbiddenException('Credentials incorrect',);
		const pwMatches = await argon.verify(user.password, password);
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');
		return this.signToken(user.id, user.username);
	}

	async oauthLogIn(profile: Profile) {
		const user = await this.prisma.user.findUnique({
			where: { id: parseInt(profile.id) },
		})
		if (!user)
		{
			const password = generator.generate({
				length: 12, // length of password
				numbers: true, // include numbers
				symbols: true, // include symbols
				uppercase: true, // include uppercase letters
				excludeSimilarCharacters: true // exclude similar characters
			  });
			const hash = await argon.hash(password);
			console.log(profile);
			this.download42Pic(profile._json.image.link, profile.id + '.png');
			try {
			  const newuser = await this.prisma.user.create({
				  data: {
					id: parseInt(profile.id),
					username: profile.username,
					password: hash,
					avatar: './uploads/' + profile.id + '.png',
				  },
			  });
			  return this.signToken(newuser.id, newuser.username);
			}
			catch (error) {
			  if (error instanceof PrismaClientKnownRequestError) {
				  if (error.code === 'P2002')
					  throw new ForbiddenException('Credentials taken');
			  }
			  throw error;
			}
		}
		else
			return this.signToken(user.id, user.username);
	}
	
	async signToken(userId: number, username: string): Promise< {access_token: string} > {
		const payload = {
			id: userId,
			username,
		}
		const secret = this.config.get('JWT_SECRET');

		const token = await this.jwt.signAsync(
			payload,
			{
				// expiresIn: '15m',
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
}
