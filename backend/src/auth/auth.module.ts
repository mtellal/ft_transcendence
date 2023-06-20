import { Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FtStrategy, JwtStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';
import { UsersGateway } from '../users/users.gateway';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [JwtModule.register({}), PrismaModule, UsersModule],
	controllers: [AuthController],
	providers: [AuthService, JwtService, JwtStrategy, ConfigService, UsersGateway, UsersService, FtStrategy],
})
export class AuthModule {}
