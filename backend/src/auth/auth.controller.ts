import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SigninDto } from "./dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	@Post('signup')
	@ApiOperation({description: 'Creates a new user with the specified username and password. The username must be unique. Returns a JWT corresponding to the user'})
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}
	
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	@ApiOperation({description: 'Sign in using an existing user credentials. Returns a JWT corresponding to that user'})
	signin(@Body() {username, password}: SigninDto) {
		return this.authService.signin(username, password);
	}
}
