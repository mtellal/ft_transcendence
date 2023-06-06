import { Controller, Get, Delete, NotFoundException, Param, ParseIntPipe, Post, Patch, Body, UseGuards, Req, ForbiddenException, UsePipes, ValidationPipe, Query, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateChannelDto, MessageDto, PatchChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { MessageType, User } from '@prisma/client';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly chatGateway: ChatGateway) {}

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
    const member = channel.members.filter((id) => id !== channel.ownerId);
    for (const memberId of member) {
      this.chatGateway.server.to(this.chatGateway.getSocketId(memberId)).emit('newChannel', channel);
    }
    return channel;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changes the type and/or password of a channel with the given ID'})
  async updateChannel(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchChannelDto, @Req() req) {
    const user: User = req.user;
    const channel = await this.chatService.findOne(id);
    if (!channel)
      throw new NotFoundException(`Channel with id of ${id} does not exist`);
    if (channel.ownerId !== user.id)
      throw new ForbiddenException(`Only the owner can change the password and/or channel type`);
    const updateChanneldto: UpdateChannelDto = {
      channelId: id,
      name: dto.name,
      type: dto.type,
      password: dto.password
    };
    const updatedChannel = await this.chatService.updateChannel(updateChanneldto, channel);
    let updateNotif = `${user.username} updated the channel:`;
    if (dto.password)
      updateNotif += ` ${channel.name} is now protected by a password.`
    if (dto.type && !dto.password)
      updateNotif += ` ${channel.name} is now ${dto.type.toLowerCase()}.`
    const notif: MessageDto = {
      channelId: channel.id,
      type: MessageType.NOTIF,
      content: updateNotif
    }
    const message = await this.chatService.createNotif(notif);
    this.chatGateway.server.to(channel.id.toString()).emit('message', message);
    if (dto.name) {
      this.chatGateway.server.to(channel.id.toString()).emit('updateChannelName', {
        channelId: channel.id,
        name: dto.name
      });
    }
    this.chatGateway.server.to(channel.id.toString()).emit('updatedChannel', updatedChannel);
    return updatedChannel;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a channel by its id'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
