import { patchState, signalStore, withHooks, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';

export const FinesAccountStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    account_number: null as string | null,
    account_id: null as number | null,
    party_id: null as string | null,
    party_type: null as string | null,
    party_name: null as string | null,
    base_version: null as string | null,
    business_unit_id: null as string | null,
    business_unit_user_id: null as string | null,
    welsh_speaking: null as string | null,
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
          account_id: store.account_id(),
          party_id: store.party_id(),
          party_type: store.party_type(),
          party_name: store.party_name(),
          base_version: store.base_version(),
          business_unit_id: store.business_unit_id(),
          business_unit_user_id: store.business_unit_user_id(),
          welsh_speaking: store.welsh_speaking(),
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
