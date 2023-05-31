import { User } from '~modules/user/shared/user.model';

export interface AuthProps {
  token: string | null;
  user: User | null;
}
