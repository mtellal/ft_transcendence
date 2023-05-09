import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { ChannelType } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"

export class CreateChannelDto {

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty()
  @IsEnum(ChannelType)
  type: ChannelType
}

export class MessageDto {
  @ApiProperty()
  @IsNumber()
  sendBy: number

  @ApiProperty()
  @IsString()
  content: string

  @ApiProperty()
  @IsNumber()
  channelId: number
}
