import { Message } from 'discord.js';
import { GuildRow } from 'src/lib/types/guilds';
import { UserRow } from 'src/lib/types/user';

export interface MessageCommand {
  name: string;
  process(
    message: Message,
    guildRow?: GuildRow,
    userRow?: UserRow,
  ): Promise<void>;
}

export default class MessageCommandHandler {
  constructor(private readonly commands: MessageCommand[]) {}

  public getCommands() {
    return this.commands;
  }

  public getCommand(content: string) {
    return this.commands.find((cmd) =>
      content.toLowerCase().startsWith(cmd.name),
    );
  }
}
