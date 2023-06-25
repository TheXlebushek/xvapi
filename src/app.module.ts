import { Module } from '@nestjs/common';
import { XVAPIModule } from './xvapi/xvapi.module';
import { ClientModule } from './client/client.module';
import { GlobalsModule } from './xvapi/globals/globals.module';

@Module({
  imports: [XVAPIModule, ClientModule, GlobalsModule],
})
export class AppModule {}
