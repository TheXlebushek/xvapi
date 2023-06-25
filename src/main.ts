import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '../frontend/'));
  app.setBaseViewsDir(join(__dirname, '../views/'));
  app.engine(
    'hbs',
    hbs.engine({
      layoutsDir: 'views/layouts',
      defaultLayout: 'layout',
      extname: 'hbs',
    }),
  );
  app.setViewEngine('hbs');
  // app.set('view engine', 'hbs');
  // hbs.registerPartials(__dirname + '/views/partials');
  // app.set('views', __dirname + '/views');
  // app.use(express.urlencoded({ extended: false }));
  await app.listen(5555);
}
bootstrap();
