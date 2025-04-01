import { patchState, signalStore, withHooks, withState, withMethods, withComputed } from '@ngrx/signals';
import { IFinesMacPayloadAccount } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account.interface';
import { IFinesMacAccountTimelineData } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { IFinesMacPayloadAccountSnapshot } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account-snapshot.interface';
import { FINES_DRAFT_STATE } from '../constants/fines-draft-state.constant';
import { IFinesMacAddAccountPayload } from '../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { computed } from '@angular/core';

export const FinesDraftStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    business_unit_id: 0 as number | null,
    submitted_by: '' as string | null,
    submitted_by_name: '' as string | null,
    account: {} as IFinesMacPayloadAccount,
    account_type: '' as string | null,
    account_status: '' as string | null,
    timeline_data: [{}] as IFinesMacAccountTimelineData[],
    draft_account_id: 0 as number | null,
    created_at: '' as string | null,
    account_snapshot: {} as IFinesMacPayloadAccountSnapshot | null,
    account_status_date: '' as string | null,
    fragment: '',
    amend: false,
    bannerMessage: '',
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, FINES_DRAFT_STATE);
      },
    };
  }),
  withComputed((store) => ({
    getAccountStatus: computed(() => {
      return store.account_status() ?? '';
    }),
  })),
  withMethods((store) => ({
    setBusinessUnitId: (business_unit_id: number) => {
      patchState(store, { business_unit_id });
    },
    setSubmittedBy: (submitted_by: string) => {
      patchState(store, { submitted_by });
    },
    setSubmittedByName: (submitted_by_name: string) => {
      patchState(store, { submitted_by_name });
    },
    setAccount: (account: IFinesMacPayloadAccount) => {
      patchState(store, { account });
    },
    setAccountType: (account_type: string) => {
      patchState(store, { account_type });
    },
    setAccountStatus: (account_status: string) => {
      patchState(store, { account_status });
    },
    setTimelineData: (timeline_data: IFinesMacAccountTimelineData[]) => {
      patchState(store, { timeline_data });
    },
    setDraftAccountId: (draft_account_id: number) => {
      patchState(store, { draft_account_id });
    },
    setCreatedAt: (created_at: string) => {
      patchState(store, { created_at });
    },
    setAccountSnapshot: (account_snapshot: IFinesMacPayloadAccountSnapshot | null) => {
      patchState(store, { account_snapshot });
    },
    setAccountStatusDate: (account_status_date: string) => {
      patchState(store, { account_status_date });
    },
    setFinesDraftState: (finesDraftState: IFinesMacAddAccountPayload) => {
      patchState(store, {
        draft_account_id: finesDraftState.draft_account_id,
        created_at: finesDraftState.created_at,
        account_snapshot: finesDraftState.account_snapshot,
        account_status_date: finesDraftState.account_status_date,
        business_unit_id: finesDraftState.business_unit_id,
        submitted_by: finesDraftState.submitted_by,
        submitted_by_name: finesDraftState.submitted_by_name,
        account: finesDraftState.account,
        account_type: finesDraftState.account_type,
        account_status: finesDraftState.account_status,
        timeline_data: finesDraftState.timeline_data,
      });
    },
    getFinesDraftState: () => {
      const finesDraftStore: IFinesMacAddAccountPayload = {
        draft_account_id: store.draft_account_id(),
        created_at: store.created_at(),
        account_snapshot: store.account_snapshot(),
        account_status_date: store.account_status_date(),
        business_unit_id: store.business_unit_id(),
        submitted_by: store.submitted_by(),
        submitted_by_name: store.submitted_by_name(),
        account: store.account(),
        account_type: store.account_type(),
        account_status: store.account_status(),
        timeline_data: store.timeline_data(),
      };
      return finesDraftStore;
    },
    resetFineDraftState: () => {
      patchState(store, FINES_DRAFT_STATE);
    },
    setFragment: (fragment: string) => {
      patchState(store, { fragment });
    },
    resetFragment: () => {
      patchState(store, { fragment: '' });
    },
    setAmend(state: boolean) {
      patchState(store, { amend: state });
    },
    resetAmend() {
      patchState(store, { amend: false });
    },
    setFragmentAndAmend(fragment: string, state: boolean) {
      patchState(store, { fragment, amend: state });
    },
    resetFragmentAndAmend() {
      patchState(store, { fragment: '', amend: false });
    },
    setBannerMessage: (bannerMessage: string) => {
      patchState(store, { bannerMessage });
    },
    resetBannerMessage: () => {
      patchState(store, { bannerMessage: '' });
    },
  })),
);
