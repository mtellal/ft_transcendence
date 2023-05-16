import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, FriendshipDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { ChannelType } from '@prisma/client';

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

  async removeFriend(id: number, friendId: number)
  {
    const user = this.prisma.user.findUnique({where: {id}});
    const newFriendlist = (await user).friendList.filter(id => id !== friendId);
    return this.prisma.user.update({
      where: {id},
      data: {friendList: newFriendlist},
    });
  }

  async getChannels(id: number) {
    return await this.prisma.channel.findMany({
      where: {
        type: {
          in: [ChannelType.PUBLIC, ChannelType.PROTECTED, ChannelType.PRIVATE]
        },
        members: {
          has: id
        }
      }
    })
  }

  async getWhispers(friendshipDto: FriendshipDto) {
    return await this.prisma.channel.findMany({
      where : {
        type: {
          equals: ChannelType.WHISPER
        },
        members: {
          hasEvery: [friendshipDto.id, friendshipDto.friendId]
        }
    }})
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
