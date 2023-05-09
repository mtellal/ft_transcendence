import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Channel, User } from '@prisma/client';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto, owner: User): Promise<Channel> {
    const newRoom = await this.prisma.channel.create({data: {
      name: createChannelDto.name,
      password: createChannelDto.password,
      type: createChannelDto.type,
      ownerId: owner.id,
      administrators: owner.id,
      members: owner.id,
      }
    })
    await this.prisma.user.update({
      where: {id: owner.id},
      data: {
        channelList:{push: newRoom.id},
      }
    })
    return newRoom;
  }

  findAll() {
    return this.prisma.channel.findMany();
  }

  findOne(id: number) {
    return this.prisma.channel.findUnique({
      where: {id}
    })
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
