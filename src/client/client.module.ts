import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../public'),
      renderPath: join(__dirname, '../../public'),
    }),
  ],
  controllers: [ClientController],
})
export class ClientModule {}
