import { Injectable } from '@nestjs/common';
import { User } from '../globals/user';
import { Config } from '../globals/utilities';

@Injectable()
export class StorefrontService {
  private prefetchedData = {
    skins: [],
  };

  constructor() {
    fetch('https://valorant-api.com/v1/weapons/skins/', {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < data.data.length; ++i) {
          this.prefetchedData.skins.push({
            pageUUID: data.data[i].uuid,
            contentTiedUUID: data.data[i].contentTierUuid,
            displayName: data.data[i].displayName,
            displayIcon: data.data[i].levels[0].displayIcon,
            uuid: data.data[i].levels[0].uuid,
          });
        }
        console.log(`[STOREFRONT] skins data prefetched`);
      });
  }

  async fetchStoreOffers(user: User, config: Config) {
    let response = await fetch(
      `https://pd.eu.a.pvp.net/store/v2/storefront/${user.uuid}`,
      {
        method: 'GET',
        headers: {
          cookie: user.cookieManager.getCookieString(),
          Authorization: `Bearer ${user.accessToken}`,
          'X-Riot-Entitlements-JWT': user.entitlement,
        },
      },
    ).then((r) => r.json());

    const offers = [];
    for (
      let i = 0;
      i < response.SkinsPanelLayout.SingleItemStoreOffers.length;
      ++i
    )
      offers.push({
        uuid: response.SkinsPanelLayout.SingleItemStoreOffers[i].OfferID,
        cost: response.SkinsPanelLayout.SingleItemStoreOffers[i].Cost[
          '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'
        ],
        displayIcon: '',
        displayName: '',
        highlightColor: '',
        rarityIcon: '',
      });

    const contentTiers = await fetch(
      'https://valorant-api.com/v1/contenttiers',
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        const retVal = [];
        for (let i = 0; i < data.data.length; ++i) {
          retVal.push({
            uuid: data.data[i].uuid,
            highlightColor: data.data[i].highlightColor,
            displayIcon: data.data[i].displayIcon,
          });
        }
        return retVal;
      });

    for (let i = 0; i < offers.length; ++i) {
      const found = this.prefetchedData.skins.find(
        (e) => e.uuid == offers[i].uuid,
      );
      const foundTiers = contentTiers.find(
        (e) => e.uuid == found.contentTiedUUID,
      );
      offers[i].displayName = found.displayName;
      offers[i].displayIcon = found.displayIcon;
      offers[i].highlightColor = foundTiers.highlightColor;
      offers[i].rarityIcon = foundTiers.displayIcon;
    }

    const currencies = [];
    await fetch('https://valorant-api.com/v1/currencies')
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < data.data.length; ++i) {
          if (
            [
              '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741',
              'e59aa87c-4cbf-517a-5983-6e81511be9b7',
            ].some((e) => e == data.data[i].uuid)
          ) {
            currencies.push({
              uuid: data.data[i].uuid,
              displayIcon: data.data[i].displayIcon,
              displayName: data.data[i].displayName,
              amount: 0,
            });
          }
        }
      });

    await fetch(`https://pd.eu.a.pvp.net/store/v1/wallet/${user.uuid}`, {
      method: 'GET',
      headers: {
        cookie: user.cookieManager.getCookieString(),
        Authorization: `Bearer ${user.accessToken}`,
        'X-Riot-Entitlements-JWT': user.entitlement,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < currencies.length; ++i)
          currencies[i].amount = data.Balances[currencies[i].uuid];
      });

    response = {
      timeLeft:
        response.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds,
      offers,
      currencies,
    };

    return response;
  }

  async fetchNightMarket(user: User, config: Config) {
    let response = await fetch(
      `https://pd.eu.a.pvp.net/store/v2/storefront/${user.uuid}`,
      {
        method: 'GET',
        headers: {
          cookie: user.cookieManager.getCookieString(),
          Authorization: `Bearer ${user.accessToken}`,
          'X-Riot-Entitlements-JWT': user.entitlement,
        },
      },
    ).then((r) => r.json());

    const currencies = [];
    await fetch('https://valorant-api.com/v1/currencies')
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < data.data.length; ++i) {
          if (
            [
              '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741',
              'e59aa87c-4cbf-517a-5983-6e81511be9b7',
              '85ca954a-41f2-ce94-9b45-8ca3dd39a00d',
            ].some((e) => e == data.data[i].uuid)
          ) {
            currencies.push({
              uuid: data.data[i].uuid,
              displayIcon: data.data[i].displayIcon,
              displayName: data.data[i].displayName,
              amount: 0,
            });
          }
        }
      });

    await fetch(`https://pd.eu.a.pvp.net/store/v1/wallet/${user.uuid}`, {
      method: 'GET',
      headers: {
        cookie: user.cookieManager.getCookieString(),
        Authorization: `Bearer ${user.accessToken}`,
        'X-Riot-Entitlements-JWT': user.entitlement,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < currencies.length; ++i)
          currencies[i].amount = data.Balances[currencies[i].uuid];
      });

    if (!response.BonusStore) return { timeLeft: 0, currencies };

    const offers = [];
    for (let i = 0; i < response.BonusStore.BonusStoreOffers.length; ++i) {
      offers.push({
        uuid: response.BonusStore.BonusStoreOffers[i].Offer.OfferID,
        discountCost:
          response.BonusStore.BonusStoreOffers[i].DiscountCosts[
            '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'
          ],
        discount: response.BonusStore.BonusStoreOffers[i].DiscountPercent,
        cost: response.BonusStore.BonusStoreOffers[i].Offer.Cost[
          '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'
        ],
        displayIcon: '',
        displayName: '',
        highlightColor: '',
        rarityIcon: '',
      });
    }

    const contentTiers = await fetch(
      'https://valorant-api.com/v1/contenttiers',
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        const retVal = [];
        for (let i = 0; i < data.data.length; ++i) {
          retVal.push({
            uuid: data.data[i].uuid,
            highlightColor: data.data[i].highlightColor,
            displayIcon: data.data[i].displayIcon,
          });
        }
        return retVal;
      });

    for (let i = 0; i < offers.length; ++i) {
      const found = this.prefetchedData.skins.find(
        (e) => e.uuid == offers[i].uuid,
      );
      const foundTiers = contentTiers.find(
        (e) => e.uuid == found.contentTiedUUID,
      );
      offers[i].displayName = found.displayName;
      offers[i].displayIcon = found.displayIcon;
      offers[i].highlightColor = foundTiers.highlightColor;
      offers[i].rarityIcon = foundTiers.displayIcon;
    }

    response = {
      timeLeft: response.BonusStore.BonusStoreRemainingDurationInSeconds,
      offers,
      currencies,
    };

    return response;
  }

  async fetchWeapon(uuid: string, config: Config) {
    const skinUUID = this.prefetchedData.skins.find(
      (e) => e.uuid == uuid,
    ).pageUUID;
    const weaponInfo = await fetch(
      `https://valorant-api.com/v1/weapons/skins/${skinUUID}?language=${config.language}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    ).then((r) => r.json());

    const contentTiers = await fetch(
      'https://valorant-api.com/v1/contenttiers',
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        const retVal = [];
        for (let i = 0; i < data.data.length; ++i) {
          retVal.push({
            uuid: data.data[i].uuid,
            highlightColor: data.data[i].highlightColor,
            displayIcon: data.data[i].displayIcon,
          });
        }
        return retVal;
      });

    const found = this.prefetchedData.skins.find((e) => e.uuid == uuid);
    const foundTiers = contentTiers.find(
      (e) => e.uuid == found.contentTiedUUID,
    );

    const chromas = [];
    weaponInfo.data.chromas.forEach((chroma) =>
      chromas.push({
        displayIcon: chroma.displayIcon,
        fullRender: chroma.fullRender,
        displayName: chroma.displayName,
        streamedVideo: chroma.streamedVideo,
      }),
    );

    const levels = [];
    weaponInfo.data.levels.forEach((level) =>
      levels.push({
        displayIcon: level.displayIcon,
        displayName: level.displayName,
        streamedVideo: level.streamedVideo,
      }),
    );

    return {
      chromas,
      levels,
      displayName: weaponInfo.data.displayName,
      wallpaper: weaponInfo.data.wallpaper,
      rarityIcon: foundTiers.displayIcon,
      highlightColor: foundTiers.highlightColor,
    };
  }

  async fetchAccessoryStore(user: User, config: Config) {
    let response = await fetch(
      `https://pd.eu.a.pvp.net/store/v2/storefront/${user.uuid}`,
      {
        method: 'GET',
        headers: {
          cookie: user.cookieManager.getCookieString(),
          Authorization: `Bearer ${user.accessToken}`,
          'X-Riot-Entitlements-JWT': user.entitlement,
        },
      },
    ).then((r) => r.json());

    const offers = [];
    for (
      let i = 0;
      i < response.AccessoryStore.AccessoryStoreOffers.length;
      ++i
    ) {
      offers.push({
        uuid: response.AccessoryStore.AccessoryStoreOffers[i].Offer.Rewards[0]
          .ItemID,
        cost: response.AccessoryStore.AccessoryStoreOffers[i].Offer.Cost[
          '85ca954a-41f2-ce94-9b45-8ca3dd39a00d'
        ],
        displayIcon: '',
        displayName: '',
        largeImage: '',
        typeId:
          response.AccessoryStore.AccessoryStoreOffers[i].Offer.Rewards[0]
            .ItemTypeID,
      });
    }

    for (let i = 0; i < offers.length; ++i) {
      if (offers[i].typeId == 'd5f120f8-ff8c-4aac-92ea-f2b5acbe9475') {
        const sprayData = await fetch(
          `https://valorant-api.com/v1/sprays/${offers[i].uuid}`,
        ).then((r) => r.json());
        offers[i].displayName = sprayData.data.displayName;
        offers[i].displayIcon = sprayData.data.displayIcon;
        offers[i].largeImage =
          sprayData.data.animationPng || sprayData.data.fullTransparentIcon;
      }

      if (offers[i].typeId == 'dd3bf334-87f3-40bd-b043-682a57a8dc3a') {
        const sprayData = await fetch(
          `https://valorant-api.com/v1/buddies/levels/${offers[i].uuid}`,
        ).then((r) => r.json());
        offers[i].displayName = sprayData.data.displayName;
        offers[i].displayIcon = sprayData.data.displayIcon;
        offers[i].largeImage = sprayData.data.displayIcon;
      }

      if (offers[i].typeId == '3f296c07-64c3-494c-923b-fe692a4fa1bd') {
        const sprayData = await fetch(
          `https://valorant-api.com/v1/playercards/${offers[i].uuid}`,
        ).then((r) => r.json());
        offers[i].displayName = sprayData.data.displayName;
        offers[i].displayIcon = sprayData.data.displayIcon;
        offers[i].largeImage = sprayData.data.largeArt;
      }

      if (offers[i].typeId == 'de7caa6b-adf7-4588-bbd1-143831e786c6') {
        const sprayData = await fetch(
          `https://valorant-api.com/v1/playertitles/${offers[i].uuid}`,
        ).then((r) => r.json());
        offers[i].displayName = sprayData.data.displayName;
        offers[i].displayIcon = sprayData.data.displayIcon;
      }
    }

    const currencies = [];
    await fetch('https://valorant-api.com/v1/currencies')
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < data.data.length; ++i) {
          if (
            ['85ca954a-41f2-ce94-9b45-8ca3dd39a00d'].some(
              (e) => e == data.data[i].uuid,
            )
          ) {
            currencies.push({
              uuid: data.data[i].uuid,
              displayIcon: data.data[i].displayIcon,
              displayName: data.data[i].displayName,
              amount: 0,
            });
          }
        }
      });

    await fetch(`https://pd.eu.a.pvp.net/store/v1/wallet/${user.uuid}`, {
      method: 'GET',
      headers: {
        cookie: user.cookieManager.getCookieString(),
        Authorization: `Bearer ${user.accessToken}`,
        'X-Riot-Entitlements-JWT': user.entitlement,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        for (let i = 0; i < currencies.length; ++i)
          currencies[i].amount = data.Balances[currencies[i].uuid];
      });

    response = {
      timeLeft:
        response.AccessoryStore.AccessoryStoreRemainingDurationInSeconds,
      offers,
      currencies,
    };

    return response;
  }
}
