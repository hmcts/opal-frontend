import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FINES_SA_SEARCH_ROUTING_PATHS } from '../fines-sa-search/routing/constants/fines-sa-search-routing-paths.constant';
import { computed } from '@angular/core';
import { FinesSaSearchAccountTab } from '../fines-sa-search/fines-sa-search-account/types/fines-sa-search-account-tab.type';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';

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
          searchAccount: {} as IFinesSaSearchAccountState,
          activeTab: 'individuals' as FinesSaSearchAccountTab,
          stateChanges: false,
          unsavedChanges: false,
        });
      },
    };
  }),
  withComputed(() => ({
    getFilterByBusinessUnitsPath: computed(() => {
      return FINES_SA_SEARCH_ROUTING_PATHS.children.filterBusinessUnit;
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
        searchAccount: {} as IFinesSaSearchAccountState,
      });
    },
    resetStateChangesUnsavedChanges: () => {
      patchState(store, { stateChanges: false, unsavedChanges: false });
    },
    resetStore: () =>
      patchState(store, {
        searchAccount: {} as IFinesSaSearchAccountState,
        activeTab: 'individuals' as FinesSaSearchAccountTab,
        stateChanges: false,
        unsavedChanges: false,
      }),
  })),
);
