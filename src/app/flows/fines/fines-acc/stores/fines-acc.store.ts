import { patchState, signalStore, withHooks, withState, withMethods, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FINES_ACCOUNT_STATE } from '../constants/fines-account-state.constant';
import { IOpalFinesDefendantAccountHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';
import { FinesMacPayloadService } from '../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';



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
    const payloadService = inject(FinesMacPayloadService);
    const globalStore = inject(GlobalStore);
    return {
      setAccountState: (headingData: IOpalFinesDefendantAccountHeader) => {
        const party_name = `${headingData.title} ${headingData.firstnames} ${headingData.surname?.toUpperCase()}`;
        const business_unit_user_id = payloadService.getBusinessUnitBusinessUserId(
          Number(headingData.business_unit_id),
          globalStore.userState(),
        );
        patchState(store, {
          account_number: headingData.account_number,
          party_id: headingData.debtor_type,
          party_type: headingData.debtor_type,
          party_name: party_name,
          base_version: Number(headingData.version),
          business_unit_user_id: business_unit_user_id,
        });
      },
      setHasVersionMismatch: (value: boolean) => {
        patchState(store, { hasVersionMismatch: value });
      },
      setSuccessMessage: (message: string | null) => {
        console.log('setting success message:', message);
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
          successMessage: null
        });
      },
      clearSuccessMessage: () => {
        console.log('clearing success message');
        patchState(store, { successMessage: null });
      }
    };
  }),
);
