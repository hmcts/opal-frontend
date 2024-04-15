import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SessionEndpoints } from '@enums';
import { IUserState } from '@interfaces';
import { StateService } from '@services';

import { Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly stateService = inject(StateService);

  /**
   * Retrieves the user state as an observable.
   * If the user state is already available, it returns it immediately.
   * Otherwise, it makes an HTTP GET request to fetch the user state and caches it for future use.
   * @returns An observable that emits the user state.
   */
  public getUserState(): Observable<IUserState> {
    return this.stateService.userState?.userId
      ? of(this.stateService.userState)
      : this.http
          .get<IUserState>(SessionEndpoints.userState)
          .pipe(shareReplay(1))
          .pipe(tap((userState) => (this.stateService.userState = userState)));
  }
}
