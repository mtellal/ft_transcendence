import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status)
  userStatus?: Status;
}
