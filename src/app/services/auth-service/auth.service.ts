import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

import { SsoEndpoints } from '@routing/enums/sso-endpoints';
import { GlobalStateService } from '../global-state-service/global-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly globalStateService = inject(GlobalStateService);

  public checkAuthenticated() {
    return this.http
      .get<boolean>(SsoEndpoints.authenticated, {
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
