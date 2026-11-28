import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { FINES_AEC_STORE_STATE } from '../constants/fines-aec-store-state.constant';
import { FinesAecTab } from '../types/fines-aec-tab.type';

export const FinesAecStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ ...FINES_AEC_STORE_STATE })),
  withHooks((store) => ({
    /** Restores the default state when the store is destroyed. */
    onDestroy() {
      patchState(store, FINES_AEC_STORE_STATE);
    },
  })),
  withMethods((store) => ({
    /**
     * Retains the selected configuration tab for return links within the AEC flow.
     * @param activeTab - URL fragment identifying the selected tab.
     */
    setActiveTab: (activeTab: FinesAecTab) => {
      patchState(store, { activeTab });
    },
    /**
     * Stores the confirmation to display when returning from a successful amendment.
     * @param successMessage - Confirmation text, or null to clear the pending message.
     */
    setSuccessMessage: (successMessage: string | null) => {
      patchState(store, { successMessage });
    },
    /** Clears a pending amendment confirmation after the configuration screen has consumed it. */
    clearSuccessMessage: () => {
      patchState(store, { successMessage: FINES_AEC_STORE_STATE.successMessage });
    },
    /** Restores the default Account types selection and clears pending confirmations when leaving the flow. */
    resetStore: () => {
      patchState(store, FINES_AEC_STORE_STATE);
    },
  })),
);
