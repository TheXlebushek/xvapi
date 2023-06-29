import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
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
  async auth(@Body() credentials: Credentials): Promise<string> {
    try {
      const user = await this.userService.create();
      return await this.userManagerService.auth(user, credentials);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
