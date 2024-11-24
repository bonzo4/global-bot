import { ActionRowBuilder, ButtonBuilder, ButtonInteraction } from 'discord.js';

type ButtonOptions = {
  deferReply?: boolean;
};

export interface ButtonHandler {
  customId: string;
  process(interaction: ButtonInteraction): Promise<void>;
  options: ButtonOptions;
}

export default class ButtonManager {
  constructor(private readonly buttons: ButtonHandler[]) {}

  public getButtons() {
    return this.buttons;
  }

  public getButton(customId: string) {
    return this.buttons.find((btn) => btn.customId.startsWith(customId));
  }

  public async executeButton(
    process: ButtonHandler['process'],
    interaction: ButtonInteraction,
    options: ButtonOptions = {},
  ) {
    if (options.deferReply) {
      await interaction.deferUpdate();
    }

    await process(interaction);
  }
}
