import { ApiProperty } from "@nestjs/swagger";
import { ChannelType, MessageType } from "@prisma/client"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class MessageDto {
  @IsNumber()
  channelId: number;

  @IsOptional()
  @IsEnum(MessageType)
  type: MessageType;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateChannelDto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsEnum(ChannelType)
  type: ChannelType

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string

  @ApiProperty()
  @IsArray()
  @IsOptional()
  members?: number[]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  administrators?: number[]

  @ApiProperty()
  @IsArray()
  @IsOptional()
  banList?: number[]
}

export class JoinChannelDto {

  @IsNumber()
  channelId: number

  @IsString()
  @IsOptional()
  password?: string
}

export class AddUserDto {
  @IsNumber()
  channelId: number

  @IsNumber()
  userId: number
}

export class AdminActionDto {
  @IsNumber()
  channelId: number

  @IsNumber()
  userId: number

  @IsString()
  @IsOptional()
  reason: string
}

export class MuteDto {
  @IsNumber()
  channelId: number

  @IsNumber()
  userId: number

  @IsNumber()
  duration: number

  @IsString()
  @IsOptional()
  reason?: string
}

export class LeaveChannelDto {
  @IsNumber()
  channelId: number
}

export class UpdateChannelDto {
  @ApiProperty()
  @IsNumber()
  channelId: number

  @ApiProperty()
  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string
}
