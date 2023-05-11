import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/channel.dto';
import { User } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto, owner: User) {
    console.log(createChannelDto);
    console.log(owner);
  }
}
