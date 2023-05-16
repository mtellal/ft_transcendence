import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

  @ApiProperty({description: 'Name of the user', example: 'test'})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({description: 'Password of the user', example: 'test'})
  @IsString()
  @IsNotEmpty()
  password: string;

}

export class FriendshipDto {
  @ApiProperty({description: 'id of the first user', example: '1'})
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({description: 'id of the second user', example: '2'})
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}
