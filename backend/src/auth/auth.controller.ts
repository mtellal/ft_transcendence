import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Redirect, Req, Request, Res, UseGuards, ParseBoolPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SigninDto, TradeDto } from "./dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FTOauthGuard, JwtGuard } from "./guard";

@ApiTags('auth')
@Controller('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	@Post('signup')
	@ApiOperation({ summary: 'Sign up',
	description: 'Creates a new user with the specified username and password. The username must be unique. Returns a JWT corresponding to the user' })
	@ApiBody({type: AuthDto})
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}
	
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	@ApiOperation({ summary: 'Sign in', description: 'Sign in using existing user credentials. Returns a JWT corresponding to that user' })
	@ApiBody({ type: SigninDto })
 	@ApiQuery({ name: 'step', required: false, type: 'string' })
	async signin(@Body() body: SigninDto, @Query('twoFA', ParseBoolPipe) twoFA?: boolean) {
		let response;
		if (twoFA)
			response = await this.authService.signin(body.username, body.password, body.code);
		else
			response = await this.authService.signin(body.username, body.password);
		return { step: response.step,  access_token: response.access_token };
	}

	@Get('42')
	@ApiOperation({ summary: 'ftAuth', description: 'Endpoint description for redirecting to 42 oauth service' })
	@ApiBearerAuth()
	@UseGuards(FTOauthGuard)
	ftAuth(@Req() req){
		return;
	}

	@Get('42/redirect')
	@ApiBearerAuth()
	@UseGuards(FTOauthGuard)
	@ApiOperation({ summary: 'ftAuthCallback', description: 'Endpoint description 42oauth service redirect endpoint, returns otp in query to use with 42/trade enpoint' })
	async ftAuthCallback(@Req() req, @Res() res) {
		const code = await this.authService.oauthLogIn(req.user);
		const redirectUrl = 'http://localhost:8080/login?oauth_code=' + code;
		console.log(code);
		res.redirect(redirectUrl);
	}

	@Post('42/trade')
	@ApiOperation({ summary: 'Trade 42 OAuth_code and 2fa code', description: 'Trade the 42 OAuth code and 2fa code if necessary for a JWT access token' })
	@ApiBody({ type: TradeDto })
	async ftAuthTrade(@Body() body: TradeDto) {
		return await this.authService.oauthTrade(body.oauth_code, body.otp_code);
	}

	@Put('twofactor')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update 2FA status', description: 'Accept a query parameter to enable or disable 2FA for the user' })
	@ApiQuery({ name: 'enable', required: true, type: 'boolean' })
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	async updateTwoFA(@Query('enable', ParseBoolPipe) enable: boolean, @Req() req) {
		await this.authService.updateTwoFactorStatus(req.user.id, enable);
		return 'success';
	}

	@Get('qrcode')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Generate QR code', description: 'Generate a QR code for the user to scan' })
	@UseGuards(JwtGuard)
	async generateQR(@Req() req) {
		const qrcode = await this.authService.generateQRcode(req.user.id);
		return { qrcode };
	}
}
