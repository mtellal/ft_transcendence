import { ChannelType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class MessageDto {
  @IsNumber()
  channelId: number;

  @IsNumber()
  sendBy: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateChannelDto {

  @IsString()
  name: string

  @IsEnum(ChannelType)
  type: ChannelType

  @IsString()
  @IsOptional()
  password?: string
}

export class JoinChannelDto {

  @IsNumber()
  id: number

  @IsString()
  @IsOptional()
  password: string
}
