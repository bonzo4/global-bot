import CommandManager, {
  generateCommands,
} from 'src/services/discord/events/interactions/commands';
import ChannelCache from './channelCache';
import 'dotenv/config';

require('dotenv').config();

async function registerCommands() {
  try {
    const channelCache = new ChannelCache([]);
    const commands = generateCommands(channelCache);

    const currentCommands = await CommandManager.listCommands();

    const removedCommands = currentCommands.filter(
      (command) => !commands.find((c) => c.name === command.name),
    );
    const newCommands = commands.filter(
      (command) => !currentCommands.find((c) => c.name === command.name),
    );
    const commandsToUpdate = commands.filter((command) =>
      currentCommands.find((c) => c.name === command.name),
    );

    if (removedCommands.length) {
      await CommandManager.deleteCommands(removedCommands);
    }
    console.log(
      'Removed commands:',
      removedCommands.map((c) => c.name),
    );

    if (newCommands.length) {
      await CommandManager.registerCommands(newCommands);
    }
    console.log(
      'New commands:',
      newCommands.map((c) => c.name),
    );

    if (commandsToUpdate.length) {
      const commandsWithId = commandsToUpdate.map((command) => {
        const currentCommand = currentCommands.find(
          (c) => c.name === command.name,
        );
        if (!currentCommand) {
          throw new Error(`Command ${command.name} not found`);
        }
        return {
          ...command,
          commandId: currentCommand.id,
        };
      });
      await CommandManager.updateCommands(commandsWithId);
    }
    console.log(
      'Updated commands:',
      commandsToUpdate.map((c) => c.name),
    );
  } catch (error) {
    console.error(error);
  }
}

registerCommands();
