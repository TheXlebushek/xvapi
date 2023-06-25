import { Module } from '@nestjs/common';
import { StorefrontModule } from './storefront/storefront.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [StorefrontModule, UserModule],
})
export class XVAPIModule {}
