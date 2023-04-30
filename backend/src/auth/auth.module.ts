import { Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
	imports: [JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}