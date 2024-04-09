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
   * Gets the user state.
   *
   * @returns An observable of the user state.
   */
  public getUserState(): Observable<IUserState> {
    return this.http
      .get<IUserState>(SessionEndpoints.userState)
      .pipe(shareReplay(1))
      .pipe(tap((userState) => (this.stateService.userState = userState)));
  }
}
