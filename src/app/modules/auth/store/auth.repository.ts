import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { createStore, select, setProps, withProps } from '@ngneat/elf';
import { AuthProps } from '~modules/auth/store/interfaces/auth-props.interface';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { Observable } from 'rxjs';
import { User } from '~modules/user/shared/user.model';
import { AuthService } from '~modules/auth/shared/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  $user: Observable<User | null>;
  private readonly authStore;

  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.authStore = createStore(
      { name: 'auth' },
      withProps<AuthProps>({
        user: null,
        token: null,
      })
    );

    persistState(this.authStore, {
      key: 'auth',
      storage: localStorageStrategy,
    });

    this.$user = this.authStore.pipe(select(state => state.user));
  }

  getAccessTokenValue() {
    return this.authStore.getValue().token;
  }

  updateTokens(token: string) {
    this.authStore.update(setProps({ token }));
  }

  setUser(user: User) {
    this.authStore.update(state => ({
      ...state,
      user,
    }));
  }

  isLoggedIn() {
    return this.authStore.pipe(select(state => !!state.token));
  }

  isLoggedInValue(): boolean {
    try {
      const token = this.getAccessTokenValue();
      if (token) {
        return !!AuthService.decodeToken(token);
      }
      return false;
    } catch (Error) {
      return false;
    }
  }

  clear() {
    this.authStore.update(setProps({ user: null, token: null }));
  }
}