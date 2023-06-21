import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class BlockGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private jwtService: JwtService) {
		super();
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		console.log('IN BLOCK')
		const request = context.switchToHttp().getRequest();
		let token = request.headers.authorization;
		console.log(request.headers)
		if (token)
			token = token.split(' ')[1];
		if (token) {
		  try {
			const decodedToken = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
			return false;
		  } catch (error) {
			return true;
		  }
		}
		return true;
	  }
}