import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ClientController {
  constructor() {}

  @Get()
  login(@Res() res: Response) {
    res.render('login', { layout: 'basic', title: 'login' });
  }

  //TODO
  // @Get('xvapi')
  // xvapi(@Res() res: Response) {
  //   res.render('docs', {layout: 'docs', title: 'docs'})
  // }

  @Get('store')
  store(@Res() res: Response) {
    res.render('store', { layout: 'main', title: 'store' });
  }

  @Get('collections')
  collections(@Res() res: Response) {
    res.render('collections', { layout: 'main', title: 'collections' });
  }

  @Get('night-market')
  nightMarket(@Res() res: Response) {
    res.render('night-market', { layout: 'main', title: 'night market' });
  }

  @Get('weapon/:uuid')
  weapon(@Res() res: Response, @Param('uuid') uuid: string) {
    res.render('weapon', { layout: 'main', title: 'weapon' });
  }
}
