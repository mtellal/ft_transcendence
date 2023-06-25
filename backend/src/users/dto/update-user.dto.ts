import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty({description: 'Path of the profile image', example: `uploads/profileImages/example.jpg`})
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({description: 'Status of the User', example: `ONLINE`})
  @IsOptional()
  @IsEnum(Status)
  userStatus?: Status;
}
