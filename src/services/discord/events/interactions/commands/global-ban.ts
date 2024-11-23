import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from 'discord.js';
import { CommandHandler } from '.';
import { getUser } from 'src/lib/data/users/getUser';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { searchUser } from 'src/lib/data/users/searchUser';
import { updateGuildUser } from 'src/lib/data/guilds/updateGuildUser';
import { updateUser } from 'src/lib/data/users/updateUser';

export default class GlobalBanCommand implements CommandHandler {
  name = 'global-ban';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Ban a user from using global chat.')
    .addStringOption((option) =>
      option
        .setName('user')
        .setDescription('The username or user ID to ban.')
        .setRequired(true),
    );

  options = {
    deferReply: true,
  };

  process = async (interaction: ChatInputCommandInteraction<'cached'>) => {
    const shard = interaction.client.shard;

    if (!shard) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            'This command can only be used in a sharded environment.',
          ),
        ],
        ephemeral: true,
      });
      return;
    }
    const mod = await getUser(interaction.user.id);

    if (!mod || !mod.is_mod) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('You do not have permission to use this command.'),
        ],
        ephemeral: true,
      });
    }

    const userString = interaction.options.getString('user');

    if (!userString) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Please provide a user to ban.')],
        ephemeral: true,
      });
      return;
    }

    const user = await searchUser(userString);

    if (!user) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('User not found.')],
        ephemeral: true,
      });
      return;
    }

    await updateGuildUser(interaction.guildId, user.id, {
      banned: true,
    });

    await updateUser(user.id, {
      banned: true,
    });

    await shard.broadcastEval(broadcastBan, {
      context: {
        userId: user.id,
      },
    });

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(`User ${user.display_name} has been banned.`),
      ],
      ephemeral: true,
    });
  };
}

export function broadcastBan(client: Client, { userId }: { userId: string }) {
  client.emit('globalBan', { userId });
}
