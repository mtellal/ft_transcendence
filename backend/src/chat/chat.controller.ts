import { Controller, Get, Delete, NotFoundException, Param, ParseIntPipe, Post, Patch, Body, UseGuards, Req, ForbiddenException, UsePipes, ValidationPipe, Query, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { User } from '@prisma/client';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    type: String
  })
  @ApiOperation({ summary: 'Returns all channels or an array of channel with the corresponding name'})
  async getChannels(@Query('name') name: string) {
    if (name) {
      const channels = await this.chatService.findbyName(name);
      if (channels.length === 0) {
        throw new NotFoundException(`No channel with the name ${name} exists`)
      }
      return (channels);
    }
    return this.chatService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a channel with the given ID'})
  async getChannel(@Param('id', ParseIntPipe) id: number) {
    const channel = await this.chatService.findOne(id);

    if (!channel) {
      throw new NotFoundException(`Channel with id of ${id} does not exist`);
    }
    return (channel);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Returns all messages from a channel with the given ID'})
  async getChannelMessages(@Param('id', ParseIntPipe) id: number) {
    const channel = await this.chatService.findOne(id);

    if (!channel) {
      throw new NotFoundException(`Channel with id of ${id} does not exist`);
    }

    return this.chatService.getMessage(id);
  }

  @Put()
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({summary: 'Creates a channel and returns it'})
  async create(@Body() createChannelDto: CreateChannelDto, @Req() req) {
    const user: User = req.user
    const channel = await this.chatService.createChannel(createChannelDto, user);
    return channel;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changes the type and/or password of a channel with the given ID'})
  async updateChannel(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChannelDto, @Req() req) {
    const user: User = req.user;
    const channel = await this.chatService.findOne(id);
    if (!channel)
      throw new NotFoundException(`Channel with id of ${dto.channelId} does not exist`);
    if (channel.ownerId !== user.id)
      throw new ForbiddenException(`Only the owner can change the password and/or channel type`);
    return await this.chatService.updateChannel(dto, channel);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a channel by its id'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
