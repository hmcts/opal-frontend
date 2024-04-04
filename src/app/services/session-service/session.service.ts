import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SessionEndpoints } from '@enums';
import { IUserState } from '@interfaces';

import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);

  /**
   * Gets the user state.
   *
   * @returns An observable of the user state.
   */
  public getUserState(): Observable<IUserState> {
    return this.http.get<IUserState>(SessionEndpoints.userState).pipe(shareReplay(1));
  }
}
