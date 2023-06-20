import { ApiProperty } from "@nestjs/swagger";
import { ChannelType, GameType, MessageType } from "@prisma/client"
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

export class InviteDto {
  @IsNumber()
  channelId: number;

  @IsEnum(GameType)
  @IsOptional()
  gametype: GameType
}

export class CreateInviteDto {
  @IsNumber()
  channelId: number;

  @IsNumber()
  userId: number;

  @IsEnum(GameType)
  @IsOptional()
  gametype: GameType;

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

  @ApiProperty()
  @IsNumber()
  channelId: number

  @ApiProperty()
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
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string
}

export class PatchChannelDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string
}
