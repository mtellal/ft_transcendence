import { ChannelType } from "@prisma/client"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateChannelDto {

  @IsString()
  channelName: String

  @IsEnum(ChannelType)
  channelType: ChannelType

  @IsString()
  @IsOptional()
  channelPassword?: String
}

export class joinChannelDto {

  @IsNumber()
  channelId: number

  @IsString()
  channelPassword: String
}
