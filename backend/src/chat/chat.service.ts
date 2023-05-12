import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, JoinChannelDto } from './dto/channel.dto';
import { Channel, User } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.channel.findMany()
  }

  async findOne(id: number) {
    return this.prisma.channel.findUnique({
      where: { id }
    });
  }

  async create(createChannelDto: CreateChannelDto, owner: User): Promise<Channel> {
    console.log(createChannelDto);
    console.log(owner);
    const newChannel = await this.prisma.channel.create({ data: {
      name: createChannelDto.name,
      type: createChannelDto.type,
      password: createChannelDto.password,
      ownerId: owner.id,
      administrators: owner.id,
      members: owner.id,
    }});
    await this.prisma.user.update({
      where: { id: owner.id },
      data: {
        channelList: { push: newChannel.id }
      }
    })
    return newChannel;
  }

  async join(dto: JoinChannelDto ,channel: Channel, newUser: User) {
    console.log(newUser);
    if (newUser.channelList.includes(channel.id)) {
      console.log('User already on the channel');
      return ;
    }
    if (channel.type === 'PROTECTED' && !dto.password) {
      console.log('No password provided');
      return ;
    }
  }
}
