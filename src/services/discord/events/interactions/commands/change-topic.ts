import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from 'discord.js';
import { CommandHandler } from '.';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { getUser } from 'src/lib/data/users/getUser';

export default class ChangeTopicCommand implements CommandHandler {
  name = 'change-topic';
  commandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Change the topic of all global channels.')
    .addStringOption((option) =>
      option
        .setName('topic')
        .setDescription('The new topic to set.')
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

    const admin = await getUser(interaction.user.id);

    if (!admin || !admin.is_admin) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('You do not have permission to use this command.'),
        ],
        ephemeral: true,
      });
    }

    const topic = interaction.options.getString('topic');

    if (!topic) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Please provide a topic to set.')],
        ephemeral: true,
      });
      return;
    }

    shard.broadcastEval(BroadcastTopic, { context: { topic } });

    await interaction.followUp({
      embeds: [EmbedUtils.Success(`The topic has been set.`)],
    });
  };
}

export async function BroadcastTopic(
  client: Client,
  { topic }: { topic: string },
): Promise<void> {
  client.emit('changeTopic', {
    topic,
  });
}
