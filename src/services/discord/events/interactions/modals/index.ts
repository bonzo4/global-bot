import { ModalSubmitInteraction } from 'discord.js';

type ModalOptions = {
  deferReply?: boolean;
};

export interface ModalHandler {
  customId: string;
  process(interaction: ModalSubmitInteraction): Promise<void>;
  options: ModalOptions;
}

export default class ModalManager {
  constructor(private readonly modals: ModalHandler[]) {}

  public getModals() {
    return this.modals;
  }

  public getModal(customId: string) {
    return this.modals.find((btn) => customId.startsWith(btn.customId));
  }

  public async executeModal(
    process: ModalHandler['process'],
    interaction: ModalSubmitInteraction,
    options: ModalOptions = {},
  ) {
    if (options.deferReply) {
      await interaction.deferUpdate();
    }

    await process(interaction);
  }
}
