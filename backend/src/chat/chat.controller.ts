import { Controller, Get, Delete, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all channels'})
  async getChannels() {
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

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a channel by its id'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.remove(id);
  }
}
