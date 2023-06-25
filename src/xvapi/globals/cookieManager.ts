export class CookieManager {
  private cookies: string[];

  constructor() {
    this.cookies = [];
  }

  add(response: Response, cookieNames: string[]): void {
    const addition = response.headers
      .get('set-cookie')
      .split(' ')
      .filter((e) => cookieNames.some((ee) => e.includes(ee)));
    this.cookies.push(...addition);
  }

  getCookieString(): string {
    return this.cookies
      .join(' ')
      .substring(0, this.cookies.join(' ').length - 1);
  }
}
