import {
  Controller,
  Post,
  Param,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { UserManagerService } from '../globals/userManager.service';

@Controller('xvapi/storefront')
export class StorefrontController {
  constructor(
    private readonly storefrontService: StorefrontService,
    private readonly userManagerService: UserManagerService,
  ) {}

  @Get('store/:uuid')
  async fetchStore(
    @Param('uuid') uuid: string,
    @Query('language') language: string,
  ) {
    try {
      language = language || 'en-US';
      const user = await this.userManagerService.getByUUID(uuid);
      const storeOffers = await this.storefrontService.fetchStoreOffers(user, {
        language,
      });
      return storeOffers;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('nightMarket/:uuid')
  async fetchNightMarket(
    @Param('uuid') uuid: string,
    @Query('language') language: string,
  ) {
    try {
      language = language || 'en-US';
      const user = await this.userManagerService.getByUUID(uuid);
      const NMOffers = await this.storefrontService.fetchNightMarket(user, {
        language,
      });
      return NMOffers;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('weapon/:uuid')
  async fetchWeapon(
    @Param('uuid') uuid: string,
    @Query('language') language: string,
  ) {
    try {
      language = language || 'en-US';
      console.log(uuid);
      const weaponData = await this.storefrontService.fetchWeapon(uuid, {
        language,
      });
      return weaponData;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
