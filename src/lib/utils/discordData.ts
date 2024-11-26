import { REST, RESTGetCurrentApplicationResult, Routes } from 'discord.js';

export async function getServerCount(): Promise<number> {
  let rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const response = await rest.get(Routes.currentApplication());
  const data = response as RESTGetCurrentApplicationResult;

  const serverCount = data.approximate_guild_count;

  if (!serverCount) {
    throw new Error('Failed to fetch application data');
  }

  return serverCount;
}
