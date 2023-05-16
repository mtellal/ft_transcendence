import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
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
}
