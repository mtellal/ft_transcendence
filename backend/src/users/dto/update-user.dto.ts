import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty()
  @IsOptional()
  @IsEnum(Status)
  userStatus?: Status;
}
