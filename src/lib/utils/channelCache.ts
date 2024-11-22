export default class ChannelCache {
  constructor(private readonly globalChannelIds: string[]) {}

  public isGlobalChannel(channelId: string): boolean {
    return this.globalChannelIds.includes(channelId);
  }

  public addGlobalChannel(channelId: string): void {
    this.globalChannelIds.push(channelId);
  }

  public removeGlobalChannel(channelId: string): void {
    const index = this.globalChannelIds.indexOf(channelId);
    if (index !== -1) {
      this.globalChannelIds.splice(index, 1);
    }
  }

  public getGlobalChannelIds(): string[] {
    return this.globalChannelIds;
  }
}
