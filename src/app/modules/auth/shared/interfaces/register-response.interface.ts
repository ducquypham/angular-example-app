import { User } from '~modules/user/shared/user.model';

export interface RegisterResponse {
  token: string;
  createdAt: string;
  id: Number;
  updateAt: string;
  username: string;
}
