import { signalStore, withState, withMethods, patchState, withComputed, withHooks } from '@ngrx/signals';
import { computed } from '@angular/core';
import { IFinesConSelectBuState } from '../select-business-unit/fines-con-select-bu/interfaces/fines-con-select-bu-state.interface';
import { IFinesConSelectBuForm } from '../select-business-unit/fines-con-select-bu/interfaces/fines-con-select-bu-form.interface';
import { FINES_CON_SELECT_BU_FORM } from '../select-business-unit/fines-con-select-bu/constants/fines-con-select-bu-form.constant';
import { IFinesConSearchAccountState } from '../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { FINES_CON_SEARCH_ACCOUNT_STATE } from '../consolidate-acc/fines-con-search-account/constants/fines-con-search-account-state.constant';

export const FinesConStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    selectBuForm: FINES_CON_SELECT_BU_FORM,
    searchAccountForm: FINES_CON_SEARCH_ACCOUNT_STATE,
    activeTab: 'search',
    stateChanges: false,
    unsavedChanges: false,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, {
          selectBuForm: FINES_CON_SELECT_BU_FORM,
          searchAccountForm: FINES_CON_SEARCH_ACCOUNT_STATE,
          activeTab: 'search',
          stateChanges: false,
          unsavedChanges: false,
        });
      },
    };
  }),
  withComputed((store) => {
    return {
      /**
       * Gets the selected business unit ID
       */
      getBusinessUnitId: computed(() => {
        return store.selectBuForm().formData.fcon_select_bu_business_unit_id;
      }),

      /**
       * Gets the selected defendant type
       */
      getDefendantType: computed(() => {
        return store.selectBuForm().formData.fcon_select_bu_defendant_type;
      }),
    };
  }),
  withMethods((store) => ({
    /**
     * Updates the business unit and defendant type selection
     */
    updateSelectBuForm(formData: IFinesConSelectBuState): void {
      patchState(store, {
        selectBuForm: {
          ...store.selectBuForm(),
          formData,
        },
        stateChanges: true,
      });
    },

    /**
     * Updates the entire select BU form including nested flow flag
     */
    updateSelectBuFormComplete(form: IFinesConSelectBuForm): void {
      patchState(store, {
        selectBuForm: form,
      });
    },

    /**
     * Persists temporary/transient search account form data in the store.
     * Used to preserve form state when navigating to intermediate steps.
     *
     * @param formData The search account form data to persist
     */
    updateSearchAccountFormTemporary(formData: IFinesConSearchAccountState): void {
      patchState(store, {
        searchAccountForm: formData,
      });
    },

    /**
     * Resets the search account form state to its initial value.
     */
    resetSearchAccountForm(): void {
      patchState(store, {
        searchAccountForm: FINES_CON_SEARCH_ACCOUNT_STATE,
      });
    },

    /**
     * Resets the entire consolidation form state
     */
    resetConsolidationState(): void {
      patchState(store, {
        selectBuForm: FINES_CON_SELECT_BU_FORM,
        searchAccountForm: FINES_CON_SEARCH_ACCOUNT_STATE,
        stateChanges: false,
        activeTab: 'search',
        unsavedChanges: false,
      });
    },

    /**
     * Sets the active tab in consolidation page
     */
    setActiveTab: (activeTab: string) => {
      patchState(store, {
        activeTab,
      });
    },

    /**
     * Updates the state changes flag
     */
    setStateChanges: (stateChanges: boolean) => {
      patchState(store, {
        stateChanges,
      });
    },

    /**
     * Updates the unsaved changes flag
     */
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, {
        unsavedChanges,
      });
    },

    /**
     * Resets both state changes and unsaved changes flags
     */
    resetStateChangesUnsavedChanges: () => {
      patchState(store, { stateChanges: false, unsavedChanges: false });
    },
  })),
);
