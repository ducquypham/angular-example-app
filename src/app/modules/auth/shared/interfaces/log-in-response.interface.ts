import { User } from '~modules/user/shared/user.model';

export interface LogInResponse {
  token: string;
  createdAt: string;
  id: Number;
  updateAt: string;
  username: string;
}
