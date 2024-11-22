import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  PermissionsBitField,
  REST,
  Routes,
  RESTGetAPIApplicationCommandsResult,
  APIApplicationCommand,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { EmbedUtils } from 'src/lib/utils/embeds';
import GlobalChannelCommand from './global-channel';
import ChannelCache from 'src/lib/utils/channelCache';
import DisableGlobalChannelCommand from './disable-global-channel';
import FixGlobalChannelCommand from './fix-global-channel';
import GlobalAdminCommand from './global-admin';
import SetGlobalChannelCommand from './set-global-channel';
import 'dotenv/config';
import GlobalBan from './global-ban';
import GlobalBanCommand from './global-ban';
import ChangeTopicCommand from './change-topic';
import GlobalTagCommand from './global-tag';

require('dotenv').config();

type CommandOptions = {
  requiresGuild?: boolean;
  requiresAdmin?: boolean;
  requiredBotPermissions?: bigint[];
  deferReply?: boolean;
};

export interface CommandHandler {
  name: string;
  commandBuilder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  process(
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction<CacheType>,
  ): Promise<void>;
  options: CommandOptions;
}

export const generateCommands = (
  channelCache: ChannelCache,
): CommandHandler[] => [
  new ChangeTopicCommand(),
  new GlobalChannelCommand(channelCache),
  new GlobalBanCommand(),
  new DisableGlobalChannelCommand(channelCache),
  new FixGlobalChannelCommand(),
  new GlobalAdminCommand(),
  new SetGlobalChannelCommand(channelCache),
  new GlobalTagCommand(),
];

export default class CommandManager {
  constructor(private readonly commands: CommandHandler[]) {}

  public getCommands() {
    return this.commands;
  }

  public getCommand(name: string) {
    return this.commands.find((cmd) => cmd.name === name);
  }

  public async executeCommand(
    process: CommandHandler['process'],
    interaction: ChatInputCommandInteraction<CacheType>,
    options: CommandOptions = {},
  ) {
    if (options.deferReply) {
      await interaction.deferReply({ ephemeral: true });
    }
    if (options.requiresGuild && !interaction.guild) {
      return await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('This command can only be used in a server.'),
        ],
        ephemeral: true,
      });
    }

    if (options.requiredBotPermissions) {
      const hasPermissions = this.checkBotPermissions(
        interaction,
        options.requiredBotPermissions,
      );
      if (!hasPermissions)
        return await interaction.followUp({
          embeds: [
            EmbedUtils.Warning(
              'I do not have the required permissions to execute this command.\n\nI need the following permissions:\n' +
                options.requiredBotPermissions
                  .map(
                    (p) =>
                      `\`${new PermissionsBitField(p).bitfield.toLocaleString()}\``,
                  )
                  .join('\n'),
            ),
          ],
          ephemeral: true,
        });
    }

    if (
      options.requiresAdmin &&
      interaction.memberPermissions &&
      !interaction.memberPermissions.has('Administrator')
    ) {
      return await interaction.followUp({
        embeds: [
          EmbedUtils.Warning('You must have Admin to execute this command.'),
        ],
        ephemeral: true,
      });
    }

    return process(interaction);
  }

  private checkBotPermissions(
    interaction: ChatInputCommandInteraction<CacheType>,
    requiredPermissions: bigint[],
  ) {
    const guild = interaction.guild;

    if (!guild) {
      return false;
    }

    const client = guild.members.me;

    if (!client) {
      return false;
    }

    const permissions = client.permissions;

    if (!permissions) {
      return false;
    }

    return requiredPermissions.every((permission) =>
      permissions.has(permission),
    );
  }

  public static async listCommands() {
    let rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    const response = await rest.get(
      Routes.applicationCommands(process.env.DISCORD_ID!),
    );
    const data = response as RESTGetAPIApplicationCommandsResult;
    return data;
  }

  public static async registerCommands(commands: CommandHandler[]) {
    let rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    for (const command of commands) {
      await rest.post(Routes.applicationCommands(process.env.DISCORD_ID!), {
        body: command.commandBuilder.toJSON(),
      });
    }
  }

  public static async updateCommands(
    commands: (CommandHandler & { commandId: string })[],
  ) {
    let rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    for (const command of commands) {
      await rest.patch(
        Routes.applicationCommand(process.env.DISCORD_ID!, command.commandId),
        {
          body: command.commandBuilder.toJSON(),
        },
      );
    }
  }

  public static async deleteCommands(commands: APIApplicationCommand[]) {
    let rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    for (const command of commands) {
      await rest.delete(
        Routes.applicationCommand(process.env.DISCORD_ID!, command.id),
      );
    }
  }
}
