import { ChannelType } from "@prisma/client"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

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
