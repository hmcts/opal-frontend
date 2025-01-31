import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SessionEndpoints } from '@services/session-service/enums/session-endpoints';
import { ISessionTokenExpiry } from '@services/session-service/interfaces/session-token-expiry.interface';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { Observable, retry, shareReplay, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly globalStateService = inject(GlobalStateService);
  private userStateCache$!: Observable<ISessionUserState>;
  private tokenExpiryCache$!: Observable<ISessionTokenExpiry> | null;

  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 1000;

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
    const refresh = !this.globalStateService.userState()?.user_id;

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
   * Retrieves the token expiry information from the server.
   * If the token expiry information is already cached, it returns the cached value.
   * Otherwise, it makes an HTTP GET request to fetch the token expiry information,
   * retries the request up to a maximum number of times if it fails, and caches the result.
   *
   * @returns {Observable<ISessionTokenExpiry>} An observable that emits the token expiry information.
   */
  public getTokenExpiry(): Observable<ISessionTokenExpiry> {
    if (!this.tokenExpiryCache$) {
      this.tokenExpiryCache$ = this.http.get<ISessionTokenExpiry>(SessionEndpoints.expiry).pipe(
        retry({
          count: this.MAX_RETRIES,
          delay: () => timer(this.RETRY_DELAY_MS),
        }),
        tap((expiry) => {
          this.globalStateService.tokenExpiry = expiry;
        }),
        shareReplay(1),
      );
    }
    return this.tokenExpiryCache$;
  }
}
