import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SessionEndpoints } from '@enums';
import { IUserState } from '@interfaces';
import { StateService } from '@services';
import { firstValueFrom, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly http = inject(HttpClient);
  private readonly stateService = inject(StateService);

  /**
   * Retrieves the user state on initialization.
   * @returns A Promise that resolves to an IUserState object.
   */
  public getUserStateOnInitialize(): Promise<IUserState> {
    return firstValueFrom(
      this.http
        .get<IUserState>(SessionEndpoints.userState)
        .pipe(shareReplay(1))
        .pipe(tap((userState) => this.stateService.userState.set(userState))),
    );
  }
}
