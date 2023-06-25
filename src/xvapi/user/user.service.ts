import { Injectable } from '@nestjs/common';
import { User } from '../globals/user';

@Injectable()
export class UserService {
  async create(): Promise<User> {
    try {
      const user = new User();
      return user;
    } catch (e) {
      throw new Error('An error occurred.');
    }
  }
}
