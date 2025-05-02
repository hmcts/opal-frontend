import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM } from '../constants/fines-mac-offence-details-search-offences-form.constant';
import { IFinesMacOffenceDetailsSearchOffencesForm } from '../interfaces/fines-mac-offence-details-search-offences-form.interface';

export const FinesMacOffenceDetailsSearchOffencesStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    searchOffences: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM,
    unsavedChanges: false,
    stateChanges: false,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, {
          searchOffences: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM,
          unsavedChanges: false,
          stateChanges: false,
        });
      },
    };
  }),
  withMethods((store) => ({
    setSearchOffences: (searchOffences: IFinesMacOffenceDetailsSearchOffencesForm) => {
      patchState(store, { searchOffences });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
    setStateChanges: (stateChanges: boolean) => {
      patchState(store, { stateChanges });
    },
    resetSearchOffencesStore: () => {
      patchState(store, {
        searchOffences: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM,
        unsavedChanges: false,
        stateChanges: false,
      });
    },
  })),
);
