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

  get(cookieNames: string[]): string {
    const retVal = this.cookies
      .filter((e) => cookieNames.some((ee) => e.includes(ee)))
      .join(' ');
    return retVal.substring(retVal.length - 1);
  }

  filter(cookieNames: string[]): void {
    this.cookies = this.cookies.filter((e) =>
      cookieNames.some((ee) => e.includes(ee)),
    );
  }
}
