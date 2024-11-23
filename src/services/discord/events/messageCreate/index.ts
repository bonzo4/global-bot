import { ChannelType, Client, ClientEvents, Message } from 'discord.js';
import ChannelCache from 'src/lib/utils/channelCache';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { getGlobalChannel } from 'src/lib/data/channels/getGlobalChannel';
import { getUser } from 'src/lib/data/users/getUser';
import { insertUser } from 'src/lib/data/users/insertUser';
import RequiredPermissions from 'src/lib/utils/permissions';
import { updateUser } from 'src/lib/data/users/updateUser';
import { insertMessage } from 'src/lib/data/messages/insertMessage';
import { getAllLinks, wrapProfanities } from 'src/lib/utils/profanity';
import { updateMessage } from 'src/lib/data/messages/updateMessage';
import AllowedLinks from 'src/lib/utils/allowedLinks';
import { EventHandler } from '..';
import MessageCommandHandler from './messageCommand';

export default class MessageCreateHandler implements EventHandler {
  eventName: keyof ClientEvents = 'messageCreate';
  constructor(
    private readonly channelCache: ChannelCache,
    private readonly allowedLinks: AllowedLinks,
    private readonly messageCommandHandler: MessageCommandHandler,
  ) {}

  process = async (message: Message): Promise<void> => {
    const guild = message.guild;
    if (!guild) return;

    const shard = message.client.shard;
    if (!shard) return;

    const channel = await message.channel.fetch();
    if (channel.type !== ChannelType.GuildText) return;
    if (message.content.startsWith('!set-global-channel')) {
      const command = this.messageCommandHandler.getCommand(message.content);
      if (command) {
        await command.process(message);
      }
      return;
    }
    if (!this.channelCache.isGlobalChannel(message.channel.id)) return;

    if (message.author.bot) return;
    if (message.author.id === process.env.DISCORD_ID) return;

    const guildRow = await getGuild(guild.id);
    if (!guildRow) return;

    const globalChannelRow = await getGlobalChannel(message.channel.id);
    if (!globalChannelRow) return;

    if (!guild.members.me) return;
    const permissions = channel.permissionsFor(guild.members.me);
    const missingPermissions = permissions.missing(
      RequiredPermissions.globalPermissions,
    );
    if (missingPermissions.length) return;

    const webhooks = await channel.fetchWebhooks();
    const hasWebhook = webhooks.some(
      (webhook) => webhook.url === globalChannelRow.webhook_url,
    );
    if (!hasWebhook) return;

    const userRow = await this.fetchUser(message);

    await insertMessage({
      id: message.id,
      user_id: userRow.id,
      content: wrapProfanities(message.content),
      guild_id: guild.id,
    });

    if (message.attachments.size) {
      await message.delete();
      await updateMessage(message.id, {
        deleted: true,
      });
      return;
    }

    if (!message.content) {
      await message.delete();
      await updateMessage(message.id, {
        deleted: true,
      });
      return;
    }

    if (userRow.banned) {
      await message.delete();
      await updateMessage(message.id, {
        deleted: true,
      });
      return;
    }

    const links = getAllLinks(message.content);

    const hasOnlyAllowedLinks = links.every((link) =>
      this.allowedLinks.isAllowedLink(link),
    );

    if (!hasOnlyAllowedLinks) {
      await message.delete();
      await updateMessage(message.id, {
        deleted: true,
      });
      return;
    }

    await shard.broadcastEval(broadcastGlobalMessage, {
      context: { messageId: message.id, sourceChannelId: message.channel.id },
    });

    const command = this.messageCommandHandler.getCommand(message.content);
    if (command) {
      await command.process(message, guildRow, userRow);
    }
  };

  private async fetchUser(message: Message) {
    let user = await getUser(message.author.id);
    if (!user) {
      user = await insertUser({
        id: message.author.id,
        username: message.author.username,
        avatar_url: message.author.avatarURL(),
      });
    } else {
      if (
        user.username !== message.author.username ||
        user.avatar_url !== message.author.avatarURL()
      ) {
        user = await updateUser(message.author.id, {
          username: message.author.username,
          avatar_url: message.author.avatarURL(),
        });
      }
    }
    return user;
  }
}

export function broadcastGlobalMessage(
  client: Client,
  {
    messageId,
    sourceChannelId,
  }: { messageId: string; sourceChannelId: string },
) {
  client.emit('globalMessage', { messageId, sourceChannelId });
}
