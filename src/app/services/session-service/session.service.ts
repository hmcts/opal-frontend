import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SessionEndpoints } from '@enums/session-endpoints';
import { ISessionTokenExpiry, ISessionUserState } from '@interfaces';
import { GlobalStateService } from '@services';

import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly globalStateService = inject(GlobalStateService);
  private userStateCache$!: Observable<ISessionUserState>;
  private tokenExpiryCache$!: Observable<ISessionTokenExpiry>;

  /**
   * Retrieves the user state from the backend.
   * If the user state is not available or needs to be refreshed, it makes an HTTP request to fetch the user state.
   * The user state is then stored in the state service for future use.
   * The user state is cached using the `shareReplay` operator to avoid unnecessary HTTP requests.
   * @returns An observable that emits the user state.
   */
  public getUserState(): Observable<ISessionUserState> {
    // The backend can return an empty object so...
    // If we don't have a user state, then we need to refresh it...
    // And override the shareReplay cache...
    const refresh = !this.globalStateService.userState()?.userId;

    if (!this.userStateCache$ || refresh) {
      this.userStateCache$ = this.http
        .get<ISessionUserState>(SessionEndpoints.userState)
        .pipe(shareReplay(1))
        .pipe(
          tap((userState) => {
            this.globalStateService.userState.set(userState);
          }),
        );
    }

    return this.userStateCache$;
  }

  /**
   * Retrieves the token expiry information.
   * If the token expiry information is not available in the cache, it makes an HTTP request to fetch it.
   * The token expiry information is stored in the cache for subsequent calls.
   * @returns An Observable that emits the token expiry information.
   */
  public getTokenExpiry(): Observable<ISessionTokenExpiry> {
    if (!this.tokenExpiryCache$) {
      this.tokenExpiryCache$ = this.http
        .get<ISessionTokenExpiry>(SessionEndpoints.expiry)
        .pipe(shareReplay(1))
        .pipe(
          tap((expiry) => {
            this.globalStateService.tokenExpiry = expiry;
          }),
        );
    }

    return this.tokenExpiryCache$;
  }
}
