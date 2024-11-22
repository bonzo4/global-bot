import { Channel, ClientEvents } from 'discord.js';
import { EventHandler } from '.';
import ChannelCache from 'src/lib/utils/channelCache';
import { deleteGlobalChannel } from 'src/lib/data/channels/deleteGlobalChannel';

export default class ChannelDeleteHandler implements EventHandler {
  eventName: keyof ClientEvents = 'channelDelete';
  constructor(private readonly channelCache: ChannelCache) {}

  process = async (channel: Channel): Promise<void> => {
    if (this.channelCache.isGlobalChannel(channel.id)) {
      await deleteGlobalChannel(channel.id);
      this.channelCache.removeGlobalChannel(channel.id);
    }
  };
}
