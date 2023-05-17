import { ChannelType } from "@prisma/client"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class MessageDto {
  @IsNumber()
  channelId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateChannelDto {

  @IsString()
  @IsOptional()
  name?: string

  @IsEnum(ChannelType)
  type: ChannelType

  @IsString()
  @IsOptional()
  password?: string

  @IsArray()
  @IsOptional()
  memberList?: number[]

  @IsArray()
  @IsOptional()
  adminList?: number[]
}

export class JoinChannelDto {

  @IsNumber()
  channelId: number

  @IsString()
  @IsOptional()
  password: string
}

export class LeaveChannelDto {
  @IsNumber()
  channelId: number
}
