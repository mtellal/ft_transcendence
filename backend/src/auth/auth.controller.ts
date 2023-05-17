import { Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Req, Res, UseGuards } from "@nestjs/common";
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
	ftAuth(@Req() req){
		return;
	}

	@Get('42/redirect')
	@UseGuards(FTOauthGuard)
	async ftAuthCallback(@Req() req, @Res() res) {
		const token = await this.authService.oauthLogIn(req.user);
		const redirectUrl = 'http://localhost:8080/login?token=' + JSON.stringify(token);
		res.redirect(redirectUrl);
	}

	@Get('isLogined')
	@UseGuards(JwtGuard)
	async test(@Res() res) {
		res.json('success');
	}
}
