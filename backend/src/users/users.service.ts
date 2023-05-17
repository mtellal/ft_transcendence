import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, FriendRequestDto, FriendshipDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { ChannelType, FriendRequest, User } from '@prisma/client';

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
    return await this.prisma.user.findMany({
      where: {id: {in: friendIds}},
      select: {
        id: true,
        username: true,
        avatar: true,
        userStatus: true,
      }
    })
  }

  async getFriendRequest(user: User) {
    return await this.prisma.friendRequest.findMany({
      where: {userId: user.id}
    })
  }

  async checkFriendRequest(senderId: number, receiverId: number): Promise<FriendRequest> {
    return await this.prisma.friendRequest.findFirst({
      where: {
        sendBy: senderId,
        userId: receiverId,
        status: false,
      }
    })
  }

  async acceptFriendRequest() {
    
  }

  async sendFriendRequest(friend: User, user: User) {
    const newRequest = await this.prisma.friendRequest.create({
      data: {
        sendBy: user.id,
        userId: friend.id,
      }
    })
    return await this.prisma.user.update({
      where: { id: friend.id },
      data: {
        friendRequest: { connect: { id: newRequest.id } }
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
    return await this.prisma.channel.findFirst({
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
