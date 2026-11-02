import { patchState, signalStore, withHooks, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { IFinesAccAprErrorContext } from '../fines-acc-apr-error/interfaces/fines-acc-apr-error-context.interface';

export const FinesAccountStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    account_number: null as string | null,
    account_id: null as number | null,
    pg_party_id: null as string | null,
    party_id: null as string | null,
    party_type: null as string | null,
    party_name: null as string | null,
    base_version: null as string | null,
    business_unit_id: null as string | null,
    business_unit_user_id: null as string | null,
    welsh_speaking: null as string | null,
    originator_type: null as string | null,
    hasVersionMismatch: false,
    hasPaymentHold: false,
    successMessage: null as string | null,
    aprErrorContext: null as IFinesAccAprErrorContext | null,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, { ...FINES_ACCOUNT_STATE, aprErrorContext: null });
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
        const aprErrorContext = store.aprErrorContext();
        patchState(store, {
          ...accountState,
          aprErrorContext: aprErrorContext?.accountId === accountState.account_id ? aprErrorContext : null,
        });
      },
      setAprErrorContext: (context: IFinesAccAprErrorContext) => {
        patchState(store, { aprErrorContext: { ...context } });
      },
      consumeAprDraft: (
        accountId: number,
        action: IFinesAccAprErrorContext['action'],
        referenceId?: number,
      ): string | null => {
        const context = store.aprErrorContext();
        patchState(store, { aprErrorContext: null });
        return context?.accountId === accountId && context.action === action && context.referenceId === referenceId
          ? context.text
          : null;
      },
      clearAprErrorContext: () => {
        patchState(store, { aprErrorContext: null });
      },
      clearAprErrorContextForNavigation: (url: string) => {
        const context = store.aprErrorContext();
        if (!context) return;
        const root = `/fines/account/defendant/${context.accountId}/alternate/payment/reference/`;
        const destination = url.split(/[?#]/)[0];
        if (![`${root}error`, `${root}${context.action}`].includes(destination)) {
          patchState(store, { aprErrorContext: null });
        }
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
      getAccountState: () => {
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
        patchState(store, {
          ...FINES_ACCOUNT_STATE,
          hasVersionMismatch: false,
          hasPaymentHold: false,
          successMessage: null,
          aprErrorContext: null,
        });
      },
      clearSuccessMessage: () => {
        patchState(store, { successMessage: null });
      },
      compareVersion: (version: string | null) => {
        if (store.base_version() !== version) {
          patchState(store, { hasVersionMismatch: true });
        }
      },
      resetStore: () => {
        patchState(store, {
          ...FINES_ACCOUNT_STATE,
          hasVersionMismatch: false,
          hasPaymentHold: false,
          successMessage: null,
          aprErrorContext: null,
        });
      },
    };
  }),
);
