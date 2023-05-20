import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, JoinChannelDto, LeaveChannelDto, MessageDto } from './dto/channel.dto';
import { Channel, User, Message } from '@prisma/client';
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

  async createNotif(messageDto: MessageDto) {
    const message = await this.prisma.message.create({
      data: {
        channelId: messageDto.channelId,
        type: messageDto.type,
        content: messageDto.content
      }
    })
    await this.prisma.channel.update({
      where: {id: messageDto.channelId},
      data: {
        messages: { connect: {id: message.id}}
      }
    })
  }

  async getMessage(channelId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { channelId: channelId},
      orderBy: { createdAt: 'asc'},
    })
    if (messages.length === 0)
      throw new NotFoundException(`No messages on this channel`);
    return (messages);
  }

  async createChannel(createChannelDto: CreateChannelDto, owner: User): Promise<Channel> {
    let userArray: number[] = [];
    let adminArray: number[] = [];
    userArray.push(owner.id);
    adminArray.push(owner.id);
    if (createChannelDto.memberList) {
      for (let i = 0; i < createChannelDto.memberList.length; i++) {
        const user = await this.userService.findOne(createChannelDto.memberList[i]);
        console.log(user);
        if (user)
          userArray.push(createChannelDto.memberList[i]);
      }
    }
    if (createChannelDto.adminList) {
      for (let i = 0; i < createChannelDto.adminList.length; i++) {
        const user = await this.userService.findOne(createChannelDto.adminList[i]);
        if (user)
          adminArray.push(createChannelDto.adminList[i]);
      }
    }
    for (const adminId of adminArray) {
      if (!userArray.includes(adminId))
        userArray.push(adminId);
    }
    if (createChannelDto.password && createChannelDto.type === 'PROTECTED'){ 
      createChannelDto.password = await argon.hash(createChannelDto.password);
    }
    if (createChannelDto.type == 'WHISPER' && userArray.length !== 2)
      throw new NotAcceptableException(`The other user doesn't exist`);
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
    if (newUser.channelList.includes(channel.id)) {
      return;
    }
    if (channel.type === 'PRIVATE')
      throw new ForbiddenException('Can only join a private channel if invited');
    if (channel.type === 'PROTECTED') {
      const pwMatches = await argon.verify(channel.password, dto.password)
      if (!pwMatches)
        throw new ForbiddenException('Password incorrect');
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

  async addUsertoChannel(channel: Channel, newUser: User) {
    await this.prisma.user.update({
      where: {id: newUser.id},
      data: {
        channelList: {push: channel.id}
      }
    })
    return await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        members: {push: newUser.id}
      }
    })
  }

  async kickUserfromChannel(channel: Channel, usertoKick: User) {
    await this.prisma.user.update({
      where: {id: usertoKick.id},
      data: {
        channelList: usertoKick.channelList.filter((num) => num !== channel.id)
      }
    })
    const updatedMember = channel.members.filter((id) => id !== usertoKick.id);
    let updatedAdmin = channel.administrators;
    if (channel.administrators.includes(usertoKick.id))
      updatedAdmin = channel.administrators.filter((id) => id !== usertoKick.id);
    await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        administrators: updatedAdmin,
        members: updatedMember
      }
    })
  }

  async leave(channel: Channel, user: User) {
    //Check to see if the user is the owner of the channel
    let newOwner: number;
    if (channel.ownerId === user.id) {
      if (channel.members.length > 1) {
        if (channel.administrators.length > 1) {
          newOwner = channel.administrators.find((num) => num != channel.ownerId);
        }
        else {
          newOwner = channel.members.find((num) => num != channel.ownerId);
        }
      }
    }
    const updatedAdmin = channel.administrators.filter((num) => num != channel.ownerId);
    if (!updatedAdmin.includes(newOwner))
      updatedAdmin.push(newOwner);
    const updatedMember = channel.members.filter((num) => num != channel.ownerId);
    if (updatedMember.length === 0) {
      await this.prisma.channel.delete({
        where: {id: channel.id},
      });
    }
    else {
      await this.prisma.channel.update({
        where: {id: channel.id},
        data: {
          ownerId: newOwner,
          administrators: updatedAdmin,
          members: updatedMember,
        }
      })
    }
    await this.prisma.user.update({
      where: {id: user.id},
      data: {
        channelList: user.channelList.filter((num) => num !== channel.id)
      }
    })
  }

  async remove(id: number)
  {
    return this.prisma.channel.delete({
      where:{id}
    });
  }
}
