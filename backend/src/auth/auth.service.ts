import { ForbiddenException, Injectable } from "@nestjs/common"
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";


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
			return this.signToken(user.id, user.email);
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
}
