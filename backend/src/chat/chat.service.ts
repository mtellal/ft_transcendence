import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminActionDto, CreateChannelDto, JoinChannelDto, MessageDto, MuteDto, UpdateChannelDto } from './dto/channel.dto';
import { Channel, User, Message, ChannelType } from '@prisma/client';
import * as argon from 'argon2';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private userService: UsersService) {}

  async findAll() {
    return await this.prisma.channel.findMany({
      include: { muteList: true }
    })
  }

  async findOne(id: number) {
    return await this.prisma.channel.findUnique({
      where: { id },
      include: { muteList: true }
    });
  }

  async findbyName(name: string) {
    return await this.prisma.channel.findMany({
      where: {name},
      include: { muteList: true }
    })
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
    return (message);
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
    let banArray: number[] = [];
    userArray.push(owner.id);
    adminArray.push(owner.id);
    if (createChannelDto.members) {
      for (let i = 0; i < createChannelDto.members.length; i++) {
        const user = await this.userService.findOne(createChannelDto.members[i]);
        console.log(user);
        if (user)
          if (!await this.userService.checkifUserblocked(user.id, owner.id))
            userArray.push(createChannelDto.members[i]);
      }
    }
    if (createChannelDto.administrators) {
      for (let i = 0; i < createChannelDto.administrators.length; i++) {
        const user = await this.userService.findOne(createChannelDto.administrators[i]);
        if (user)
          if (!await this.userService.checkifUserblocked(user.id, owner.id))
            adminArray.push(createChannelDto.administrators[i]);
      }
    }
    for (const adminId of adminArray) {
      if (!userArray.includes(adminId))
        userArray.push(adminId);
    }
    if (createChannelDto.banList) {
      for (let i = 0; i < createChannelDto.banList.length; i++) {
        const user = await this.userService.findOne(createChannelDto.banList[i])
        if (user) {
          if (userArray.includes(user.id))
            throw new ForbiddenException(`Can't ban a member during channel creation`);
          banArray.push(createChannelDto.banList[i]);
        }
      }
    }
    if (createChannelDto.type === 'PROTECTED'){
      if (!createChannelDto.password)
        throw new ForbiddenException(`Password can't be empty`)
      createChannelDto.password = await argon.hash(createChannelDto.password);
    }
    if (createChannelDto.type !== 'PROTECTED' && createChannelDto.password) {
      throw new ForbiddenException(`Only a Protected channel can have a password`);
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
        banList: banArray
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

  async updateChannel(dto: UpdateChannelDto, channel: Channel) {
    if (dto.name) {
      if (dto.name === channel.name)
        throw new ForbiddenException(`Name is identical to the current channel name`)
      const updatedChannel = await this.prisma.channel.update({
        where: {id: channel.id},
        data: {
          name: dto.name
        }
      })
      return updatedChannel;
    }
    if (dto.password) {
      dto.password = await argon.hash(dto.password);
      const updatedChannel = await this.prisma.channel.update({
        where: {id: channel.id},
        data: {
          type: ChannelType.PROTECTED,
          password: dto.password
        }
      })
      return updatedChannel;
    }
    if (dto.type) {
      if (dto.type === 'PROTECTED' && !dto.password)
        throw new ForbiddenException(`A protected channel must have a password`);
      const updatedChannel = await this.prisma.channel.update({
        where: { id: channel.id },
        data: {
          type: dto.type,
          password: null
        }
      })
      return updatedChannel;
    }
  }

  async join(dto: JoinChannelDto, channel: Channel, newUser: User) {
    if (newUser.channelList.includes(channel.id)) {
      return;
    }
    if (channel.type === 'PRIVATE')
      throw new ForbiddenException('Can only join a private channel if invited');
    if (channel.type === 'PROTECTED') {
      if (!dto.password)
        throw new ForbiddenException('No password provided');
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
    return await this.prisma.channel.update({
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
    return await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        administrators: updatedAdmin,
        members: updatedMember
      }
    })
  }

  async muteUser(dto: MuteDto, usertoMute: User) {
    const mutedDuration = new Date();
    mutedDuration.setSeconds(mutedDuration.getSeconds() + dto.duration);
    const newMute = await this.prisma.mutedUser.create({
      data: {
        channelId: dto.channelId,
        userId: dto.userId,
        duration: mutedDuration,
      }
    })
    await this.prisma.channel.update({
      where: {id: dto.channelId},
      data: {
        muteList: {connect: {id: newMute.id}}
      }
    })
    return newMute;
  }

  async unmuteUser(dto: AdminActionDto, usertoUnmute: User) {
    return await this.prisma.mutedUser.deleteMany({
      where: {
        channelId: dto.channelId,
        userId: usertoUnmute.id
      }
    });
  }

  async checkMute (channel: Channel, user: User) {
    const mutedUser = await this.prisma.mutedUser.findFirst({
      where: {
        channelId: channel.id,
        userId: user.id
      },
      orderBy: {duration: 'desc'}
    })
    if (!mutedUser) {
      return false;
    }
    const currentTime = new Date
    if (mutedUser.duration > currentTime) {
      return true;
    }
    if (mutedUser.duration <= currentTime) {
      await this.prisma.mutedUser.deleteMany({
        where: {
          channelId: channel.id,
          userId: user.id
        }
      })
      return false;
    }
  }

  async banUser(channel: Channel, usertoBan: User) {
    await this.prisma.user.update({
      where: {id: usertoBan.id},
      data: {
        channelList: usertoBan.channelList.filter((num) => num !== channel.id)
      }
    })
    const updatedMember = channel.members.filter((id) => id !== usertoBan.id);
    let updatedAdmin = channel.administrators;
    if (channel.administrators.includes(usertoBan.id))
      updatedAdmin = channel.administrators.filter((id) => id !== usertoBan.id);
    return await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        administrators: updatedAdmin,
        members: updatedMember,
        banList: {push: usertoBan.id}
      }
    })
  }

  async unbanUser(channel: Channel, usertoUnban: User) {
    return await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        banList: channel.banList.filter((id) => id !== usertoUnban.id)
      }
    })
  }

  async makeAdmin(channel: Channel, newAdmin: User) {
    return await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        administrators: {push: newAdmin.id }
      }
    })
  }

  async removeAdmin(channel: Channel, admin: User) {
    return await this.prisma.channel.update({
      where: {id: channel.id},
      data: {
        administrators: channel.administrators.filter((id) => id !== admin.id)
      }
    })
  }

  async leave(channel: Channel, user: User) {
    //Check to see if the user is the owner of the channel
    let newOwner = channel.ownerId;
    let updatedAdmin = channel.administrators;
    if (channel.ownerId === user.id) {
      if (channel.members.length > 1) {
        if (channel.administrators.length > 1) {
          newOwner = updatedAdmin.find((num) => num != channel.ownerId);
        }
        else {
          newOwner = channel.members.find((num) => num != channel.ownerId);
        }
        if (!updatedAdmin.includes(newOwner))
          updatedAdmin.push(newOwner);
      }
    }
    updatedAdmin = updatedAdmin.filter((num) => num != user.id);
    const updatedMember = channel.members.filter((num) => num != user.id);
    let updatedChannel: Channel | null = null;
    if (updatedMember.length === 0) {
      await this.prisma.channel.delete({
        where: {id: channel.id},
      });
    }
    else {
      updatedChannel = await this.prisma.channel.update({
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
    return updatedChannel;
  }

  async remove(id: number)
  {
    return await this.prisma.channel.delete({
      where:{id}
    });
  }
}
