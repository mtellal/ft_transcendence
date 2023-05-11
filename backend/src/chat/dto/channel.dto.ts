import { ChannelType } from "@prisma/client"

export class createChannelDto {
  channelName: String
  channelType: ChannelType
  channelPassword: String
}
