import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../fines-sa-search/routing/constants/fines-sa-search-routing-paths.constant';
import { computed } from '@angular/core';
import { FinesSaSearchAccountTab } from '../fines-sa-search/fines-sa-search-account/types/fines-sa-search-account-tab.type';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { IFinesSaSearchAccountFormIndividualsState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/interfaces/fines-sa-search-account-form-individuals-state.interface';
import { IFinesSaSearchAccountFormCompaniesState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/interfaces/fines-sa-search-account-form-companies-state.interface';
import { IFinesSaSearchAccountFormMinorCreditorsState } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/interfaces/fines-sa-search-account-form-minor-creditors-state.interface';

export const FinesSaStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    searchAccount: FINES_SA_SEARCH_ACCOUNT_STATE,
    activeTab: 'individuals' as FinesSaSearchAccountTab,
    resultsActiveTab: 'individuals' as FinesSaSearchAccountTab,
    stateChanges: false,
    unsavedChanges: false,
    searchAccountPopulated: false,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, {
          searchAccount: FINES_SA_SEARCH_ACCOUNT_STATE,
          activeTab: 'individuals' as FinesSaSearchAccountTab,
          stateChanges: false,
          unsavedChanges: false,
        });
      },
    };
  }),
  withComputed((store) => ({
    getFilterByBusinessUnitsPath: computed(() => {
      return FINES_SA_SEARCH_ROUTING_PATHS.children.filterBusinessUnit;
    }),
    getSearchType: computed(() => {
      const searchAccount = store.searchAccount();

      // Utility to check if an object has any populated (truthy) value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasPopulatedValues = (
        obj:
          | IFinesSaSearchAccountFormIndividualsState
          | IFinesSaSearchAccountFormCompaniesState
          | IFinesSaSearchAccountFormMinorCreditorsState,
      ): boolean => {
        return Object.values(obj).some((value) => (typeof value === 'string' ? !!value.trim() : !!value));
      };

      if (searchAccount.fsa_search_account_number?.trim()) {
        return 'accountNumber';
      }

      if (searchAccount.fsa_search_account_reference_case_number?.trim()) {
        return 'referenceCaseNumber';
      }

      if (
        searchAccount.fsa_search_account_individuals_search_criteria &&
        hasPopulatedValues(searchAccount.fsa_search_account_individuals_search_criteria)
      ) {
        return 'individuals';
      }

      if (
        searchAccount.fsa_search_account_companies_search_criteria &&
        hasPopulatedValues(searchAccount.fsa_search_account_companies_search_criteria)
      ) {
        return 'companies';
      }

      if (
        searchAccount.fsa_search_account_minor_creditors_search_criteria &&
        hasPopulatedValues(searchAccount.fsa_search_account_minor_creditors_search_criteria)
      ) {
        return 'minorCreditors';
      }

      return 'accountNumber';
    }),
  })),
  withMethods((store) => ({
    setSearchAccount: (searchAccount: IFinesSaSearchAccountState) => {
      patchState(store, {
        searchAccount: searchAccount,
        stateChanges: true,
        unsavedChanges: false,
        searchAccountPopulated: false,
      });
    },
    setSearchAccountTemporary: (searchAccount: IFinesSaSearchAccountState) => {
      patchState(store, {
        searchAccount: searchAccount,
        searchAccountPopulated: true,
      });
    },
    setActiveTab: (activeTab: FinesSaSearchAccountTab) => {
      patchState(store, {
        activeTab: activeTab,
      });
    },
    setResultsActiveTab: (resultsActiveTab: FinesSaSearchAccountTab) => {
      patchState(store, {
        resultsActiveTab: resultsActiveTab,
      });
    },
    setStateChanges: (stateChanges: boolean) => {
      patchState(store, {
        stateChanges,
      });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, {
        unsavedChanges,
      });
    },
    resetDefendantSearchCriteria: () => {
      patchState(store, {
        searchAccount: {
          ...store.searchAccount(),
          fsa_search_account_defendant_search_criteria: {},
        } as IFinesSaSearchAccountState,
      });
    },
    resetSearchAccount: () => {
      patchState(store, {
        searchAccount: FINES_SA_SEARCH_ACCOUNT_STATE,
      });
    },
    resetStateChangesUnsavedChanges: () => {
      patchState(store, { stateChanges: false, unsavedChanges: false });
    },
    resetStore: () =>
      patchState(store, {
        searchAccount: FINES_SA_SEARCH_ACCOUNT_STATE,
        activeTab: 'individuals' as FinesSaSearchAccountTab,
        stateChanges: false,
        unsavedChanges: false,
      }),
  })),
);
