import { patchState, signalStore, withHooks, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { FINES_ACCOUNT_STATE } from '../constants/fines-account-state.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';

export const FinesAccountStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    account_number: null as string | null,
    party_id: null as string | null,
    party_type: null as string | null,
    party_name: null as string | null,
    base_version: null as number | null,
    business_unit_user_id: null as string | null,
    hasVersionMismatch: false as boolean,
    successMessage: null as string | null,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, FINES_ACCOUNT_STATE);
      },
    };
  }),
  withComputed((store) => ({
    getAccountNumber: computed(() => {
      return store.account_number() ?? '';
    }),
  })),
  withMethods((store) => {
    return {
      setAccountState: (accountState: IFinesAccountState) => {
        patchState(store, accountState);
      },
      setHasVersionMismatch: (value: boolean) => {
        patchState(store, { hasVersionMismatch: value });
      },
      setSuccessMessage: (message: string | null) => {
        patchState(store, { successMessage: message });
      },
      getAccountState: () => {
        return {
          account_number: store.account_number(),
          party_id: store.party_id(),
          party_type: store.party_type(),
          party_name: store.party_name(),
          base_version: store.base_version(),
          business_unit_user_id: store.business_unit_user_id(),
        };
      },
      clearAccountState: () => {
        patchState(store, {
          ...FINES_ACCOUNT_STATE,
          hasVersionMismatch: false,
          successMessage: null,
        });
      },
      clearSuccessMessage: () => {
        patchState(store, { successMessage: null });
      },
    };
  }),
);
