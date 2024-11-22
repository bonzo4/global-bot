import {
  CacheType,
  ChatInputCommandInteraction,
  ClientEvents,
  Interaction,
  InteractionType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { EventHandler } from '..';
import CommandManager from './commands';
import { EmbedUtils } from 'src/lib/utils/embeds';

export default class InteractionHandler implements EventHandler {
  eventName: keyof ClientEvents = 'interactionCreate';

  constructor(private readonly commandManager: CommandManager) {}

  // Using an arrow function to maintain `this` context
  process = async (interaction: Interaction): Promise<void> => {
    try {
      if (interaction instanceof ChatInputCommandInteraction) {
        return await this.handleCommand(interaction);
      }
    } catch (error) {
      if (interaction instanceof ChatInputCommandInteraction) {
        if (interaction.deferred) {
          await interaction.followUp({
            embeds: [
              EmbedUtils.Error(`Something went wrong, please try again later.`),
            ],
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            embeds: [
              EmbedUtils.Error(`Something went wrong, please try again later.`),
            ],
            ephemeral: true,
          });
        }
      }

      throw new Error(error.message);
    }
  };

  private async handleCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ) {
    const command = this.commandManager.getCommand(interaction.commandName);
    if (command) {
      this.commandManager.executeCommand(
        command.process,
        interaction,
        command.options,
      );
    }
  }
}
