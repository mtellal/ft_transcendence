import { Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [JwtModule.register({}), PrismaModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService, JwtStrategy, ConfigService],
})
export class AuthModule {}
