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
    version: null as number | null,
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
  withMethods((store) => ({
    setAccountState: (account_state: IFinesAccountState) => {
      patchState(store, {
        account_number: account_state.account_number,
        party_id: account_state.party_id,
        party_type: account_state.party_type,
        party_name: account_state.party_name,
        version: account_state.version,
      });
    },
    getAccountState: () => {
      return {
        account_number: store.account_number(),
        party_id: store.party_id(),
        party_type: store.party_type(),
        party_name: store.party_name(),
        version: store.version(),
      };
    },
    clearAccountState: () => {
      patchState(store, FINES_ACCOUNT_STATE);
    },
  })),
);
