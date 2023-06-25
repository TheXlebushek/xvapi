import { Global, Module } from '@nestjs/common';
import { UserManagerService } from './userManager.service';

@Global()
@Module({
  providers: [UserManagerService],
  exports: [UserManagerService],
})
export class GlobalsModule {}
