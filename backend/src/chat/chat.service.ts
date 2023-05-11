import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/channel.dto';
import { Channel, User } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.channel.findMany()
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
}
