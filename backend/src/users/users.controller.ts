import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, Query, UseGuards, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'username',
    required: true,
    type: String
  })
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
  async getUserbyID(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }
    return (user);
  }

  @Get()
  async findbyUsername(@Query() username: string) {
    const user = await this.usersService.findbyUsername(username);

    if (!user) {
      throw new NotFoundException(`User ${username} does not exist`);
    }
    return (user);
  }


  @Get(':id/friends')
  async getFriends(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }
    return this.usersService.getFriends(user.friendList);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', storage))
  uploadfile(@UploadedFile() file, @Request() req) {
    const user: User = req.user;
    console.log(user);
    console.log(file);
    return this.usersService.update(user.id, {
      avatar: file.path
    })
  }

  @Get(':id/profileImage')
  async getProfileImage(@Param('id', ParseIntPipe) id: number, @Res() res): Promise<any> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }

    res.sendFile(join(process.cwd(), user.avatar));
  }

  @Post('addFriend')
  async addFriend(@Query('id', ParseIntPipe) id: number, @Query('id of friend', ParseIntPipe) friendId: number)
  {
    const user = await this.usersService.findOne(id);
    const friend = await this.usersService.findOne(friendId);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
    }
    if (!friend) {
      throw new NotFoundException(`User with id of ${friendId} does not exist`);
    }

    if (user.friendList.includes(friendId)) {
      console.log("Already friend!")
      return ;
    }

    this.usersService.addFriend(id, friendId);
    this.usersService.addFriend(friendId, id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
