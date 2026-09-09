import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { FINES_API_STATE } from './constants/fines-api-state.constant';
import { FinesApiTab, IFinesApiState } from './interfaces/fines-api-state.interface';

const getFinesApiState = (): IFinesApiState => ({
  ...FINES_API_STATE,
  selectedBusinessUnitIds: [...FINES_API_STATE.selectedBusinessUnitIds],
  selectedFileIds: [...FINES_API_STATE.selectedFileIds],
  overrideInhibitFileIds: [...FINES_API_STATE.overrideInhibitFileIds],
});

export const FinesApiStore = signalStore(
  { providedIn: 'root' },
  withState<IFinesApiState>(() => getFinesApiState()),
  withHooks((store) => ({
    onDestroy() {
      patchState(store, getFinesApiState());
    },
  })),
  withComputed((store) => ({
    hasSelectedBusinessUnits: computed(() => store.selectedBusinessUnitIds().length > 0),
    hasSelectedFiles: computed(() => store.selectedFileIds().length > 0),
  })),
  withMethods((store) => ({
    setSelectedBusinessUnitIds: (selectedBusinessUnitIds: number[]) => {
      patchState(store, {
        selectedBusinessUnitIds: [...selectedBusinessUnitIds],
        selectedFileIds: [],
        overrideInhibitFileIds: [],
        stateChanges: true,
        unsavedChanges: selectedBusinessUnitIds.length > 0,
      });
    },
    clearSelectedBusinessUnitIds: () => {
      patchState(store, {
        selectedBusinessUnitIds: [],
        selectedFileIds: [],
        overrideInhibitFileIds: [],
        stateChanges: false,
        unsavedChanges: false,
      });
    },
    setSelectedFileIds: (selectedFileIds: string[]) => {
      patchState(store, {
        selectedFileIds: [...selectedFileIds],
        overrideInhibitFileIds: [],
        stateChanges: true,
        unsavedChanges: selectedFileIds.length > 0,
      });
    },
    setOverrideInhibitFileIds: (overrideInhibitFileIds: string[]) => {
      patchState(store, {
        overrideInhibitFileIds: [...overrideInhibitFileIds],
      });
    },
    setActiveTab: (activeTab: FinesApiTab) => {
      patchState(store, { activeTab });
    },
    setStateChanges: (stateChanges: boolean) => {
      patchState(store, { stateChanges });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
    resetFinesApiState: () => {
      patchState(store, getFinesApiState());
    },
  })),
);
