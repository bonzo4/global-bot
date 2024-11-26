export default class AllowedLinks {
  constructor(private readonly allowedLinks: string[]) {}

  public isAllowedLink(link: string): boolean {
    try {
      const normalizedLink = new URL(link).origin;
      return this.allowedLinks.some((allowedLink) =>
        normalizedLink.startsWith(new URL(allowedLink).origin),
      );
    } catch (e) {
      // Handle any invalid URL parsing errors
      return false;
    }
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
