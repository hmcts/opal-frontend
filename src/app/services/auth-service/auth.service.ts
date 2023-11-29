import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { SsoEndpoints } from 'src/app/enums/sso-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  public readonly authenticated = signal<boolean>(false);

  public checkAuthenticated() {
    return this.http.get<boolean>(`${SsoEndpoints.authenticated}`).pipe(tap((resp) => this.authenticated.set(resp)));
  }
}
