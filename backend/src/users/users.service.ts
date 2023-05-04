import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findbyUsername(username: string) {
    return this.prisma.user.findUnique({where: {username}})
  }

  async getFriends(friendIds: number[]) {
    return this.prisma.user.findMany({
      where: {id: {in: friendIds}},
      select: {
        id: true,
        username: true,
        avatar: true,
        userStatus: true,
      }
    })
  }

  async addFriend(id: number, friendId: number)
  {
    return this.prisma.user.update({
      where: { id },
      data: { friendList: {push: friendId}}
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await argon.hash(updateUserDto.password);
    return this.prisma.user.update( {
      where : { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete( {
      where : { id },
    });
  }
}
