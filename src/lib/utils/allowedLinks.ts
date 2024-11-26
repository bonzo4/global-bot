export default class AllowedLinks {
  constructor(private readonly allowedLinks: string[]) {}

  public isAllowedLink(link: string): boolean {
    return this.allowedLinks.some((allowedLink) =>
      link.startsWith(allowedLink),
    );
  }

  public addAllowedLink(link: string): void {
    this.allowedLinks.push(link);
  }

  public removeAllowedLink(link: string): void {
    const index = this.allowedLinks.indexOf(link);
    if (index !== -1) {
      this.allowedLinks.splice(index, 1);
    }
  }
}
