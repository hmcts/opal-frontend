import { patchState, signalStore, withHooks, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { FINES_ACC_STORE_STATE } from '../constants/fines-acc-store-state.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';

export const FinesAccountStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ ...FINES_ACC_STORE_STATE })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, FINES_ACC_STORE_STATE);
      },
    };
  }),
  withComputed((store) => ({
    getAccountNumber: computed(() => {
      return store.account_number() ?? '';
    }),
    isTransferredIn: computed(() => {
      return store.originator_type()?.trim().toUpperCase() === 'TFO';
    }),
  })),
  withMethods((store) => {
    return {
      setAccountState: (accountState: IFinesAccountState) => {
        patchState(store, {
          ...accountState,
          ...(store.account_id() !== accountState.account_id
            ? { aprManageReturnUrl: FINES_ACC_STORE_STATE.aprManageReturnUrl }
            : {}),
        });
      },
      setAprManageReturnUrl: (url: string) => {
        patchState(store, { aprManageReturnUrl: url });
      },
      setHasVersionMismatch: (value: boolean) => {
        patchState(store, { hasVersionMismatch: value });
      },
      setSuccessMessage: (message: string | null) => {
        patchState(store, { successMessage: message });
      },
      setHasPaymentHold: (hasPaymentHold: boolean) => {
        patchState(store, { hasPaymentHold });
      },
      getAccountState: (): IFinesAccountState => {
        return {
          account_number: store.account_number(),
          account_id: store.account_id(),
          pg_party_id: store.pg_party_id(),
          party_id: store.party_id(),
          party_type: store.party_type(),
          party_name: store.party_name(),
          base_version: store.base_version(),
          business_unit_id: store.business_unit_id(),
          business_unit_user_id: store.business_unit_user_id(),
          welsh_speaking: store.welsh_speaking(),
          originator_type: store.originator_type(),
        };
      },
      clearAccountState: () => {
        patchState(store, FINES_ACC_STORE_STATE);
      },
      clearSuccessMessage: () => {
        patchState(store, { successMessage: FINES_ACC_STORE_STATE.successMessage });
      },
      compareVersion: (version: string | null) => {
        if (store.base_version() !== version) {
          patchState(store, { hasVersionMismatch: true });
        }
      },
      resetStore: () => {
        patchState(store, FINES_ACC_STORE_STATE);
      },
    };
  }),
);
