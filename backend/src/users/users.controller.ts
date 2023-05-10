import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, Query, UseGuards, UseInterceptors, UploadedFile, Request, Res, BadRequestException, NotAcceptableException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, FriendshipDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid'
import { User } from '@prisma/client';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({
    name: 'username',
    required: false,
    type: String
  })
  @ApiOkResponse({
    description: 'Returns an array of User or a specific User if used as a query',
  })
  @ApiNotFoundResponse({
    description: `Specific user doesn't exist`,
  })
  @ApiOperation({ summary: 'Get all users, you can also use an optional query parameter to get a user by its username by using /users?username=[username]'})
  async getUsers(@Query('username') username: string) {
    if (username)
    {
      const user = await this.usersService.findbyUsername(username);
      if (!user) {
        throw new NotFoundException(`User ${username} does not exist`);
      }
      return (user);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by its id'})
  @ApiOkResponse({
    description: 'Returns a User',
  })
  @ApiNotFoundResponse({
    description: `User with this id doesn't exist`,
  })
  async getUserbyID(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }
    return (user);
  }

/*   @Get()
  async findbyUsername(@Query() username: string) {
    const user = await this.usersService.findbyUsername(username);

    if (!user) {
      throw new NotFoundException(`User ${username} does not exist`);
    }
    return (user);
  } */


  @Get(':id/friends')
  @ApiOperation({ summary: 'Get the friendlist of a user by its ID'})
  @ApiOkResponse({
    description: 'Returns an array of User',
  })
  @ApiNotFoundResponse({
    description: `User with this id doesn't exist`,
  })
  async getFriends(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }
    return this.usersService.getFriends(user.friendList);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @ApiOperation({ summary: 'Upload an image and update the profile picture of the user identified by its JWT (Needs a valid JWT)'})
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No JWT provided or JWT invalid'
  })
  @ApiOkResponse({
    description: 'Profile image of the User has been succesfully uploaded and its path in the user record updated',
  })
  @UseInterceptors(FileInterceptor('file', storage))
  uploadfile(@UploadedFile() file, @Request() req) {
    if (!file)
      throw new BadRequestException('No file or empty file');
    const user: User = req.user;
    console.log(user);
    console.log(file);
    return this.usersService.update(user.id, {
      avatar: file.path
    })
  }

  @Get(':id/profileImage')
  @ApiOperation({ summary: 'Get the profile image of a user by its id'})
  @ApiOkResponse({
    description: 'Returns the profile image of the given User',
  })
  @ApiNotFoundResponse({
    description: `User with this id doesn't exist`,
  })
  async getProfileImage(@Param('id', ParseIntPipe) id: number, @Res() res): Promise<any> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }

    res.sendFile(join(process.cwd(), user.avatar));
  }

  @Post('addFriend')
  @ApiOperation({ summary: 'Makes two users add each other to their friendlist, this controller will be changed in the future to require an invite, this is only used for testing'})
  async addFriend(@Body() friendshipDto: FriendshipDto)
  {
    const user = await this.usersService.findOne(friendshipDto.id);
    const friend = await this.usersService.findOne(friendshipDto.friendId);

    if (!user) {
      throw new NotFoundException(`User with id of ${friendshipDto.id} does not exist`);
    }
    if (!friend) {
      throw new NotFoundException(`User with id of ${friendshipDto.friendId} does not exist`);
    }

    if (user.friendList.includes(friendshipDto.friendId)) {
      throw new NotAcceptableException('Already friend!')
    }

    this.usersService.addFriend(friendshipDto.id, friendshipDto.friendId);
    this.usersService.addFriend(friendshipDto.friendId, friendshipDto.id);
  }

  @Post('removeFriend')
  @ApiOperation({ summary: 'Makes two users remove each other to their friendlist, might need to be one-way only. Let me know what you prefer'})
  async removeFriend(@Body() friendshipDto: FriendshipDto)
  {
    const user = await this.usersService.findOne(friendshipDto.id);
    const friend = await this.usersService.findOne(friendshipDto.friendId);

    if (!user) {
      throw new NotFoundException(`User with id of ${friendshipDto.id} does not exist`);
    }
    if (!friend) {
      throw new NotFoundException(`User with id of ${friendshipDto.friendId} does not exist`);
    }

    if (!user.friendList.includes(friendshipDto.friendId)) {
      throw new NotAcceptableException('Not friends!')
    }

    this.usersService.removeFriend(friendshipDto.id, friendshipDto.friendId);
    this.usersService.removeFriend(friendshipDto.friendId, friendshipDto.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the user, all the fields are optional. Will be protected by JWT in the future'})
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user by its id'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
