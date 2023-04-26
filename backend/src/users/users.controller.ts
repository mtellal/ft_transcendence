import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id of ${id} does not exist`);
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
