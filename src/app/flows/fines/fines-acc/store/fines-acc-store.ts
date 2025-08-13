import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { IOpalFinesDefendantAccountHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

export const FinesAccStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    accountData: null as IOpalFinesDefendantAccountHeader | null,
    stateChanges: false,
    unsavedChanges: false,
  })),

  withComputed((store) => ({
    hasAccountData: computed(() => !!store.accountData()),
    defendantAccountId: computed(() => store.accountData()?.defendant_account_id || ''),
    accountNumber: computed(() => store.accountData()?.account_number || ''),
    defendantName: computed(() => {
      const accountData = store.accountData();
      if (!accountData) return '';

      if (accountData.organisation && accountData.organisation_name) {
        return accountData.organisation_name;
      }

      const parts = [accountData.title, accountData.firstnames, accountData.surname?.toUpperCase()].filter(
        (part) => part && part.trim().length > 0,
      );

      return parts.join(' ');
    }),
    accountBalance: computed(() => store.accountData()?.account_balance || 0),
    businessUnitId: computed(() => store.accountData()?.business_unit_id || ''),
    businessUnitName: computed(() => store.accountData()?.business_unit_name || ''),
    accountStatus: computed(() => store.accountData()?.account_status_display_name || ''),
    isOrganisation: computed(() => !!store.accountData()?.organisation),
  })),

  withMethods((store) => ({
    setAccountData: (accountData: IOpalFinesDefendantAccountHeader) => {
      patchState(store, {
        accountData,
        stateChanges: true,
      });
    },

    clearAccountData: () => {
      patchState(store, {
        accountData: null,
        stateChanges: true,
      });
    },

    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },

    setStateChanges: (stateChanges: boolean) => {
      patchState(store, { stateChanges });
    },
  })),
);
