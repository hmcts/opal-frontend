import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { IUserState } from '@interfaces';
import { StateService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly stateService = inject(StateService);
  private storedUserState!: IUserState | null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('userState') public readonly userState: IUserState | null,
    private readonly transferState: TransferState,
  ) {
    const storeKey = makeStateKey<IUserState | null>('userState');

    if (isPlatformBrowser(this.platformId)) {
      this.userState = this.transferState.get(storeKey, null);
      this.storedUserState = this.userState;
    } else {
      this.transferState.set(storeKey, this.userState);
    }
  }

  public storeUserStateInStateStore() {
    this.stateService.userState.set(this.storedUserState);
  }
}
