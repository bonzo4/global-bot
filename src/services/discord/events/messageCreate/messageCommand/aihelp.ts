import { Client, Message } from 'discord.js';
import { MessageCommand } from '.';
import { GuildRow } from 'src/lib/types/guilds';
import { UserRow } from 'src/lib/types/user';
import { getGameStats } from 'src/lib/data/game/getGameStats';
import insertGameStats from 'src/lib/data/game/insertGameStats';
import { aiClient } from 'src/lib/openai';
import { insertAiResponse } from 'src/lib/data/aiResponses/insertAiResponse';

export default class AiHelpMessageCommand implements MessageCommand {
  name = '!aihelp';

  process = async (
    message: Message<true>,
    guildRow: GuildRow,
    userRow: UserRow,
  ): Promise<void> => {
    const shard = message.client.shard;
    if (!shard) return;

    const question = message.content.replace('!aihelp', '').trim();

    const answer = await this.getAiHelp(question);

    const aiResponse = await insertAiResponse({
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      thread_id: process.env.OPENAI_THREAD_ID!,
      message: question,
      response: answer,
      discord_user_id: userRow.id,
    });

    shard.broadcastEval(broadcastAiHelp, {
      context: {
        responseId: aiResponse.id,
        channelId: message.channel.id,
      },
    });
  };

  async getAiHelp(question: string) {
    await aiClient.beta.threads.messages.create(process.env.OPENAI_THREAD_ID!, {
      content: question,
      role: 'assistant',
    });

    await aiClient.beta.threads.runs.createAndPoll(
      process.env.OPENAI_THREAD_ID!,
      {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      },
    );

    const messages = await aiClient.beta.threads.messages.list(
      process.env.OPENAI_THREAD_ID!,
      {
        limit: 1,
      },
    );

    const answer = messages.data[0].content[0];

    if (answer.type === 'text') {
      return answer.text.value;
    } else {
      return 'I am not sure how to answer that question.';
    }
  }
}

export function broadcastAiHelp(
  client: Client,
  { responseId, channelId }: { responseId: number; channelId: string },
) {
  client.emit('aiHelp', { responseId, channelId });
}
