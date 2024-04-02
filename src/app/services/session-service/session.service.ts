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

  /**
   * Retrieves the user state from the server.
   * Updates the user state in the state service to reflect the new state.
   * @returns An observable that emits the user state.
   */
  public getUserState(): Observable<IUserState> {
    return (
      this.http
        .get<IUserState>(SessionEndpoints.userState)
        .pipe(shareReplay(1))
        // Anytime the endpoint is called, we want to update the user state in the state service to reflect the new state.
        .pipe(tap((userState) => (this.stateService.userState = userState)))
    );
  }
}
