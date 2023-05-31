import { Hero } from '~modules/hero/shared/hero.model';

export class User {
  token: string;
  createdAt: string;
  id: Number;
  updateAt: string;
  username: string;

  // eslint-disable-next-line complexity
  constructor(user: User) {
    this.id = user?.id;
    this.token = user?.token;
    this.updateAt = user?.updateAt;
    this.username = user?.username;
    this.createdAt = user?.createdAt;
  }
}
