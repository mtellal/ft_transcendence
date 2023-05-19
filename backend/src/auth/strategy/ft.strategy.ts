import { Injectable } from "@nestjs/common";
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly configService: ConfigService,
		) {
		super({
			clientID: configService.get<string>('FT_CLIENT_ID'),
			clientSecret: configService.get<string>('FT_CLIENT_SECRET'),
			callbackURL: '/auth/42/redirect',
		});
	}

	async validate( 
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
	  ) {
		console.log(profile);
		return cb(null, profile);
	}
}