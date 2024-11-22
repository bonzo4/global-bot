import { PermissionFlagsBits } from 'discord.js';

export default class RequiredPermissions {
  public static globalPermissions = [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageWebhooks,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.EmbedLinks,
  ];
}
