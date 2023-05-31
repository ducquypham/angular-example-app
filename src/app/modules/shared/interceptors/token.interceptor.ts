import { Observable, ObservableInput, switchMap, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { AuthRepository } from '~modules/auth/store/auth.repository';
import { AppConfig } from '../../../configs/app.config';
import { AuthService } from '~modules/auth/shared/auth.service';
import { authRoutes } from '~modules/auth/shared/auth-routes';
import { Router } from '@angular/router';
import { AlertId } from '~modules/shared/services/alert.service';
import { environment } from '~environments/environment';

export class TokenInterceptor implements HttpInterceptor {
  window: Window;

  // eslint-disable-next-line max-params
  constructor(
    private router: Router,
    private authService: AuthService,
    private authRepository: AuthRepository,
    private document: Document
  ) {
    this.window = this.document.defaultView as Window;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = { req_uuid: (Date.now() + Math.random()).toString(), Authorization: '' };
    const accessToken = this.authRepository.getAccessTokenValue();
    if (accessToken  && !request.headers.get(AppConfig.bypassAuthorization)) {
      const { isAccessTokenExpired } = this.getTokenExpirations(accessToken);

      if (isAccessTokenExpired) {
          this.navigateToLogout();
          return observableThrowError(() => new Error());
      } else {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return this.sendRequest(request, next, headers);
  }

  getTokenExpirations(accessToken: string) {
    const accessTokenValue = AuthService.decodeToken(accessToken);
    const isAccessTokenExpired = Date.now() >= (accessTokenValue?.exp || 0) * 1000;
    return { isAccessTokenExpired };
  }

  checkUnAuthorizedError(response: unknown) {
    if (response instanceof HttpResponse) {
      const bodyErrors = response.body.errors;
      if (bodyErrors?.length) {
        const unAuthorizeErrorFounded = bodyErrors.find(
          (bodyError: { code: number }) => bodyError.code === 401
        );
        if (unAuthorizeErrorFounded) {
          this.navigateToLogout();
        }
      }
    }
  }

  sendRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    headers: { req_uuid: string; Authorization: string }
  ) {
    const newRequest = request.clone({ url : `${environment.baseURL}${request.url}`,setHeaders: headers });
    return next.handle(newRequest).pipe(
      map(response => {
        this.checkUnAuthorizedError(response);
        return response;
      }),
      catchError(err => observableThrowError(err))
    );
  }


  navigateToLogout() {
    this.router.navigate([authRoutes.logout], {
      queryParams: {
        origin: encodeURIComponent(this.window.location.href),
        alertId: AlertId.SESSION_EXPIRED,
      },
    });
  }
}
