import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Credentials } from '../globals/utilities';
import { UserManagerService } from '../globals/userManager.service';

@Controller('xvapi/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userManagerService: UserManagerService,
  ) {}

  @Post('auth')
  async auth(
    @Body() credentials: Credentials,
    @Query('remember') remember: string,
  ): Promise<string> {
    try {
      const user = await this.userService.create();
      const retVal = await this.userManagerService.auth(user, credentials);
      if (remember == 'true') {
        setInterval(() => {
          user.reauth();
        }, 15 * 60 * 1000);
      }
      return retVal;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
