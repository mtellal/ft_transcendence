import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, JoinChannelDto, LeaveChannelDto, MessageDto } from './dto/channel.dto';
import { Channel, User } from '@prisma/client';
import * as argon from 'argon2';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private userService: UsersService) {}

  async findAll() {
    return this.prisma.channel.findMany()
  }

  async findOne(id: number) {
    return this.prisma.channel.findUnique({
      where: { id }
    });
  }

  async createMessage(messageDto: MessageDto, sender: User)
  {
    const message = await this.prisma.message.create({
      data: {
        channelId: messageDto.channelId,
        sendBy: sender.id,
        content: messageDto.content,
      }
    })
    await this.prisma.channel.update({
      where: {id: messageDto.channelId},
      data: {
        messages: { connect: {id: message.id}}
      }
    })
    return message;
  }

  async getMessage(channelId: number) {
    return await this.prisma.message.findMany({
      where: { channelId: channelId},
      orderBy: { createdAt: 'asc'},
    })
  }

  async createChannel(createChannelDto: CreateChannelDto, owner: User): Promise<Channel> {
    let userArray: number[] = [];
    let adminArray: number[] = [];
    userArray.push(owner.id);
    adminArray.push(owner.id);
    for (let i = 0; i < createChannelDto.memberList.length; i++) {
      if (this.userService.findOne(createChannelDto.memberList[i]))
        userArray.push(createChannelDto.memberList[i]);
    }
    for (let i = 0; i < createChannelDto.adminList.length; i++) {
      if (this.userService.findOne(createChannelDto.adminList[i]))
        adminArray.push(createChannelDto.adminList[i]);
    }
    for (const adminId of adminArray) {
      if (!userArray.includes(adminId))
        userArray.push(adminId);
    }
    if (createChannelDto.password && createChannelDto.type === 'PROTECTED'){ 
      createChannelDto.password = await argon.hash(createChannelDto.password);
    }
    const newChannel = await this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        type: createChannelDto.type,
        password: createChannelDto.password,
        ownerId: owner.id,
        administrators: adminArray,
        members: userArray,
      }
    })
    for (const userId of userArray) {
      await this.prisma.user.update({
        where: {id: userId},
        data: { channelList: { push: newChannel.id }}
      })
    }
    return newChannel;
  }

  async join(dto: JoinChannelDto, channel: Channel, newUser: User) {
    console.log(newUser);
    try {
      if (newUser.channelList.includes(channel.id)) {
        return ;
      }
      if (channel.type === 'PROTECTED') {
        const pwMatches = await argon.verify(channel.password, dto.password)
        if (!pwMatches)
          throw new WsException('Password incorrect');
      }
      await this.prisma.user.update({
        where: { id: newUser.id },
        data: {
          channelList: { push: channel.id }
        }
      })
      await this.prisma.channel.update({
        where: { id: channel.id },
        data: {
          members: { push: newUser.id },
        }
      })
    }
    catch (error) {
      throw (error);
    }
  }

  async leave(dto: LeaveChannelDto, user: User) {
    
  }

  async remove(id: number)
  {
    return this.prisma.channel.delete({
      where:{id}
    });
  }
}
