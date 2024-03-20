import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';

import { IUserState } from '@interfaces';
import { StateService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private readonly stateService = inject(StateService);
  private storedUserState: IUserState | null = null;
  private storedUniquePermissionIds: number[] = [];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('userState') public readonly userState: IUserState | null,
    private readonly transferState: TransferState,
  ) {
    const storeKey = makeStateKey<IUserState | null>('userState');

    if (isPlatformBrowser(this.platformId)) {
      // get user state from transfer state if browser side
      this.userState = this.transferState.get(storeKey, null);
      this.storedUserState = this.userState;
    } else {
      // server side: get provided user state and store in transfer state
      this.transferState.set(storeKey, this.userState);
    }
  }

  /**
   * Retrieves the unique permission IDs associated with the user.
   * If the unique permission IDs have not been stored yet, it calculates them based on the user's roles and permissions.
   * @returns An array of unique permission IDs.
   */
  public getUserUniquePermissions(): number[] {
    if (!this.storedUniquePermissionIds.length) {
      const permissionIds = this.storedUserState?.roles.flatMap((role) => {
        return role.permissions.map(({ permissionId }) => permissionId);
      });

      this.storedUniquePermissionIds = [...new Set(permissionIds)];
    }

    return this.storedUniquePermissionIds;
  }

  /**
   * Initializes the user state.
   */
  public initializeUserState(): void {
    this.stateService.userState.set(this.storedUserState);
  }
}
