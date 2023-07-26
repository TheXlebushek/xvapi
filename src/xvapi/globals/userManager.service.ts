import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user';
import { Credentials } from './utilities';

@Injectable()
export class UserManagerService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async auth(user: User, credentials: Credentials): Promise<string> {
    try {
      const oldUser = this.users.find((user) => user.uuid === credentials.uuid);
      if (
        oldUser &&
        new Date().getTime() - oldUser.creationDate.getTime() < 30 * 60 * 1000
      )
        if (
          (
            await fetch(`xvapi/user/${oldUser.uuid}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            })
          ).ok
        )
          return oldUser.uuid;

      await user.init(credentials);
      this.users = this.users.filter((u) => u.uuid !== user.uuid);
      this.users.push(user);
      return user.uuid;
    } catch (e) {
      console.error(e);
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST, {
        description: e,
      });
    }
  }

  async getByUUID(uuid: string): Promise<User> {
    const user = this.users.find((user) => user.uuid == uuid);
    if (!user) throw 'User not found';
    await user.reauth();
    return user;
  }
}
