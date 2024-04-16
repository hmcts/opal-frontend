import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SessionEndpoints } from '@enums';
import { IUserState } from '@interfaces';
import { StateService } from '@services';

import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly stateService = inject(StateService);
  private userStateCache$!: Observable<IUserState>;

  /**
   * Retrieves the user state from the backend.
   * If the user state is not available or needs to be refreshed, it makes an HTTP request to fetch the user state.
   * The user state is then stored in the state service for future use.
   * The user state is cached using the `shareReplay` operator to avoid unnecessary HTTP requests.
   * @returns An observable that emits the user state.
   */
  public getUserState(): Observable<IUserState> {
    // The backend can return an empty object so...
    // If we don't have a user state, then we need to refresh it...
    // And override the shareReplay cache...
    const refresh = !this.stateService.userState()?.userId;

    if (!this.userStateCache$ || refresh) {
      this.userStateCache$ = this.http
        .get<IUserState>(SessionEndpoints.userState)
        .pipe(shareReplay(1))
        .pipe(
          tap((userState) => {
            this.stateService.userState.set(userState);
          }),
        );
    }

    return this.userStateCache$;
  }
}
