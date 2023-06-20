import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


//Temporary until we use 42's API
export class AuthDto {
	@ApiProperty({description: 'Name of the user. Is Unique', example: 'test'})
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({description: 'Password of the user. Will be hashed', example: 'test'})
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class SigninDto {
	@ApiProperty({description: 'Name of the user. Is Unique', example: 'test'})
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({description: 'Password of the user. Will be hashed', example: 'test'})
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiProperty({description: 'code of the user. Is optional', example: 'test'})
	@IsString()
	@IsOptional()
	code?: string;
}

export class TradeDto {
	@ApiProperty({ description: 'OAuth code', example: 'oauth_code' })
 	@IsString()
	@IsNotEmpty()
	oauth_code: string;

	@ApiProperty({ description: 'OTP code. Is optional', example: 'otp_code' })
	@IsString()
	@IsOptional()
	otp_code?: string;
}

export class JwtPayloadDto {
	id?: number;
	username?: string;
	iat?: number;
}