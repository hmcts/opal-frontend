import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

import { SsoEndpoints } from 'src/app/enums/sso-endpoints';
import { StateService } from '../state-service/state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly stateService = inject(StateService);

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
          this.stateService.authenticated.set(resp);
        }),
      );
  }
}
