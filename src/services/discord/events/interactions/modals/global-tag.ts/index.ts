import { ModalSubmitInteraction } from 'discord.js';
import { getGuild } from 'src/lib/data/guilds/getGuild';
import { EmbedUtils } from 'src/lib/utils/embeds';
import { ModalHandler } from '..';
import { updateGuild } from 'src/lib/data/guilds/updateGuild';
import { getGuildTag } from 'src/lib/data/guilds/getGuildTag';

export default class GlobalTagModalHandler implements ModalHandler {
  customId = 'global_tag';
  options = {
    deferReply: true,
  };

  process = async (interaction: ModalSubmitInteraction): Promise<void> => {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('This command can only be used in a server.'),
        ],
        ephemeral: true,
      });
      return;
    }

    if (
      interaction.memberPermissions &&
      !interaction.memberPermissions.has('Administrator')
    ) {
      await interaction.reply({
        embeds: [
          EmbedUtils.Warning('You must have Admin to execute this command.'),
        ],
        ephemeral: true,
      });
      return;
    }

    let guildRow = await getGuild(guild.id);

    if (!guildRow) {
      await interaction.followUp({
        embeds: [
          EmbedUtils.Warning(
            'An error occurred while fetching the server data.',
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    const tag = interaction.fields.getField('tag').value;

    if (!tag) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('Please provide a tag.')],
        ephemeral: true,
      });
      return;
    }

    const tagExists = await getGuildTag(tag);

    if (tagExists) {
      await interaction.followUp({
        embeds: [EmbedUtils.Warning('This tag already exists.')],
        ephemeral: true,
      });
      return;
    }

    await updateGuild(guild.id, { tag });

    await interaction.followUp({
      embeds: [
        EmbedUtils.Success(
          `Tag ${guildRow.tag ? 'updated' : 'set'} to: [${tag.toUpperCase()}]`,
        ),
      ],
      ephemeral: true,
    });
  };
}
