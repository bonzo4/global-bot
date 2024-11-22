import { Client } from 'discord.js';
import EventManager from './events';
import GuildJoinHandler from './events/guildJoin';
import { setGuildShardId } from 'src/lib/data/guilds/setGuildShardId';
import GuildLeaveHandler from './events/guildLeave';
import InteractionHandler from './events/interactions';
import CommandManager, {
  generateCommands,
} from './events/interactions/commands';
import { getGuildChannels } from 'src/lib/data/channels/getGuildChannels';
import ChannelCache from 'src/lib/utils/channelCache';
import MessageCreateHandler from './events/messageCreate';
import AllowedLinks from 'src/lib/utils/allowedLinks';
import { getAllowedLinks } from 'src/lib/data/messages/getAllowedLinks';
import ChannelDeleteHandler from './events/channelDelete';
import GlobalMessageHandler from './events/globalMessage';
import GlobalBanHandler from './events/globalBan';
import MessageCommandHandler from './events/messageCreate/messageCommand';
import GmMessageCommand from './events/messageCreate/messageCommand/gm';
import GmMessageHandler from './events/gmMessage';
import FlipMessageCommand from './events/messageCreate/messageCommand/flip';
import StealMessageCommand from './events/messageCreate/messageCommand/steal';
import SetGlobalCommand from './events/messageCreate/messageCommand/set-global-channel';
import AiHelpMessageCommand from './events/messageCreate/messageCommand/aihelp';

export default class Bot {
  constructor() {}

  public async start() {
    const client = new Client({
      intents: [
        'Guilds',
        'GuildMessages',
        'GuildMessageReactions',
        'DirectMessages',
        'DirectMessageReactions',
        'MessageContent',
      ],
      partials: [],
    });

    await this.onReady(client);

    await client.login(process.env.DISCORD_TOKEN);
  }

  private async onReady(client: Client) {
    client.on('ready', async () => {
      const guildIds = await this.getAllGuildIds(client);
      await this.saveShardIds(guildIds, client.shard?.ids[0] || 0);

      const globalChannelIds = await this.getChannelIds(guildIds);
      const channelCache = new ChannelCache(globalChannelIds);
      const allowedLinksList = await getAllowedLinks();
      const allowedLinks = new AllowedLinks(
        allowedLinksList.map((link) => link.link),
      );
      const commandManager = new CommandManager(generateCommands(channelCache));
      const messageCommandHandler = new MessageCommandHandler([
        new GmMessageCommand(),
        new FlipMessageCommand(),
        new StealMessageCommand(),
        new AiHelpMessageCommand(),
        new SetGlobalCommand(channelCache),
      ]);

      const eventManager = new EventManager(client, [
        new ChannelDeleteHandler(channelCache),
        new GuildJoinHandler(channelCache),
        new GuildLeaveHandler(channelCache),
        new InteractionHandler(commandManager),
        new MessageCreateHandler(
          channelCache,
          allowedLinks,
          messageCommandHandler,
        ),
        new GlobalMessageHandler(client, channelCache),
        new GlobalBanHandler(client, channelCache),
        new GmMessageHandler(client, channelCache),
      ]);
      await eventManager.start();
    });
  }

  private async saveShardIds(guildIds: string[], shardId: number) {
    await Promise.all(
      guildIds.map(async (guildId) => {
        await setGuildShardId(guildId, shardId);
      }),
    );
  }

  private async getAllGuildIds(client: Client) {
    const guilds = await client.guilds.fetch();
    return guilds.map((guild) => guild.id);
  }

  private async getChannelIds(guildIds: string[]) {
    const channelIds = await Promise.all(
      guildIds.map(async (id) => {
        const globalChannels = await getGuildChannels(id);
        return globalChannels.map((channel) => channel.id);
      }),
    );

    return channelIds.flat();
  }
}
