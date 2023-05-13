import { Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SigninDto } from "./dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FTOauthGuard, JwtGuard } from "./guard";

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

	@Get('42')
	@UseGuards(FTOauthGuard)
	hello(){
		return 'hello';
	}

	@Get('42/redirect')
	@Redirect('http://localhost:8080')
	@UseGuards(FTOauthGuard)
	ftAuthCallback(@Req() req) {
		return this.authService.oauthLogIn(req.user);
	}
}
