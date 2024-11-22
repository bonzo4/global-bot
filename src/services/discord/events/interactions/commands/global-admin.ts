import {
  channelMention,
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { CommandHandler } from '.';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { insertGuild } from 'src/lib/data/guilds/insertGuild';
import { EmbedUtils } from 'src/lib/utils/embeds';
import TickerText from 'src/lib/utils/tickerText';
import RequiredPermissions from 'src/lib/utils/permissions';
import { insertAdminChannel } from 'src/lib/data/channels/insertAdminChannel';
import { getAdminChannelByGuild } from 'src/lib/data/channels/getAdminChannel';

export default class GlobalAdminCommand implements CommandHandler {
  name = 'global-admin';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Setup the global admin channel for the server.');
  options = {
    requiresAdmin: true,
    requiresGuild: true,
    deferReply: true,
    requiredPermissions: [RequiredPermissions.globalPermissions],
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    let guildData = await getGuild(interaction.guildId);

    if (!guildData) {
      guildData = await insertGuild({
        id: interaction.guildId,
        name: interaction.guild.name,
        icon_url: interaction.guild.iconURL() || null,
      });
    }

    const adminChannelRow = await getAdminChannelByGuild(interaction.guildId);
    let adminChannel: TextChannel | undefined;

    if (adminChannelRow) {
      let adminChannel = await interaction.guild.channels.fetch(
        adminChannelRow.channel_id,
      );

      if (adminChannel) {
        await interaction.followUp({
          embeds: [
            EmbedUtils.Error(
              `Global Admin channel already exists at ${channelMention(adminChannel.id)}.`,
            ),
          ],
          ephemeral: true,
        });
        return;
      }
    }

    if (!adminChannel) {
      adminChannel = await this.createAdminChannel(interaction.guild);
    }

    await insertAdminChannel({
      guild_id: interaction.guildId,
      channel_id: adminChannel.id,
    });

    await adminChannel.send({
      embeds: [
        EmbedUtils.Info(
          `This channel is for global admins only. Use this channel for global admin discussions and announcements.`,
        ),
      ],
    });

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `Global Admin channel created at ${channelMention(adminChannel.id)}.`,
        ),
      ],
      ephemeral: true,
    });
  };

  private async createAdminChannel(guild: Guild) {
    const channel = await guild.channels.create({
      name: '⚪️┃global-admin-chat',
      type: ChannelType.GuildText,
      topic: TickerText.defaultTicker,
      permissionOverwrites: [
        {
          id: process.env.DISCORD_ID!,
          allow: RequiredPermissions.globalPermissions,
        },
        {
          id: guild.roles.everyone.id,
          deny: ['ViewChannel'],
        },
      ],
    });

    return channel;
  }
}
