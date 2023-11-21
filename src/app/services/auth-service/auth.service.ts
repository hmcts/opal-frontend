import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { SsoEndpoints } from 'src/app/enums/sso-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authenticated = signal<boolean>(false);

  public checkAuthenticated(injector: Injector) {
    return toSignal(this.http.get(SsoEndpoints.authenticated).pipe(map((res) => res)), { injector });
  }
}
