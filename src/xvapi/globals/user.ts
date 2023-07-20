import { CookieManager } from './cookieManager';
import { parse } from './utilities';
import { Credentials } from './utilities';

export class User {
  constructor() {
    this.cookieManager = new CookieManager();
  }

  async init(credentials: Credentials) {
    this.login = credentials.login;
    await this.fetchAccessToken(credentials);
    await this.fetchUUID();
    await this.fetchEntitlementToken();
    this.creationDate = new Date();
  }

  async fetchAccessToken(credentials: Credentials): Promise<void> {
    let response = await fetch(
      'https://auth.riotgames.com/api/v1/authorization',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'play-valorant-web-prod',
          nonce: '1',
          redirect_uri: 'https://playvalorant.com/opt_in',
          response_type: 'token id_token',
        }),
      },
    );
    this.cookieManager.add(response, ['__cf_bm', 'tdid', 'asid', 'clid']);

    response = await fetch('https://auth.riotgames.com/api/v1/authorization', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: this.cookieManager.getCookieString(),
      },
      body: JSON.stringify({
        type: 'auth',
        username: credentials.login,
        password: credentials.password,
        remember: true,
        language: 'en-US',
      }),
    });

    this.cookieManager.add(response, ['ssid', 'sub', 'csid']);

    response = await response.json();
    const uri = response['response'].parameters.uri;
    const ACCESS_TOKEN = parse(uri).get('access_token');
    this.accessToken = ACCESS_TOKEN;
  }

  async fetchUUID(): Promise<void> {
    const response = await fetch('https://auth.riotgames.com/userinfo', {
      method: 'GET',
      headers: {
        cookie: this.cookieManager.getCookieString(),
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    const { sub: UUID } = await response.json();
    this.uuid = UUID;
  }

  async fetchEntitlementToken(): Promise<void> {
    const response = await fetch(
      'https://entitlements.auth.riotgames.com/api/token/v1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: this.cookieManager.getCookieString(),
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );

    const { entitlements_token: entitlement } = await response.json();
    this.entitlement = entitlement;
  }

  async reauth() {
    const response = await fetch(
      'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          cookie: this.cookieManager.getCookieString(),
        },
      },
    );
    this.cookieManager.filter(['__cf_bm', 'asid']);
    this.cookieManager.add(response, ['tdid', 'clid', 'ssid', 'sub', 'csid']);

    await this.fetchEntitlementToken();
    this.creationDate = new Date();
  }

  login: string;
  accessToken: string;
  entitlement: string;
  uuid: string;
  cookieManager: CookieManager;
  creationDate: Date;
}
