import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { GlobalStateService } from '../global-state-service/global-state.service';
import { SSO_ENDPOINTS } from '@routing/constants/sso-endpoints.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly globalStateService = inject(GlobalStateService);

  public checkAuthenticated() {
    return this.http
      .get<boolean>(SSO_ENDPOINTS.authenticated, {
        headers: new HttpHeaders({
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        }),
      })
      .pipe(
        tap((resp) => {
          this.globalStateService.authenticated.set(resp);
        }),
      )
      .pipe(
        catchError((error) => {
          this.globalStateService.authenticated.set(false);
          return throwError(() => error);
        }),
      );
  }
}
