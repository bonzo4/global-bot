import { ClientEvents, Guild } from 'discord.js';
import { EventHandler } from '.';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { updateGuild } from 'src/lib/data/guilds/updateGuild';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';

export default class GuildLeaveHandler implements EventHandler {
  constructor(private readonly channelCache: ChannelCache) {}

  eventName: keyof ClientEvents = 'guildDelete';
  process = async (guild: Guild): Promise<void> => {
    const guildData = await getGuild(guild.id);

    if (!guildData) {
      await insertGuild({
        id: guild.id,
        name: guild.name,
        icon_url: guild.iconURL() || null,
        left_at: new Date().toISOString(),
      });
    } else {
      await updateGuild(guild.id, {
        left_at: new Date().toISOString(),
      });
    }

    const globalChannels = await getGuildChannels(guild.id);

    for (const channel of globalChannels) {
      const cachedChannel = this.channelCache.isGlobalChannel(channel.id);
      if (cachedChannel) {
        this.channelCache.removeGlobalChannel(channel.id);
      }
    }
  };
}
