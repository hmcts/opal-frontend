import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { FINES_API_PROCESS_ALLOCATE_TABS_KEYS } from '../fines-api-process-allocate/constants/fines-api-process-allocate-tabs-keys.constant';
import { TFinesApiProcessAllocateTabKey } from '../fines-api-process-allocate/types/fines-api-process-allocate-tab-key.type';
import { FINES_API_STATE } from './constants/fines-api-state.constant';
import { IFinesApiState } from './interfaces/fines-api-state.interface';

const getFinesApiState = (): IFinesApiState => ({
  ...FINES_API_STATE,
  selectedBusinessUnitIds: [...FINES_API_STATE.selectedBusinessUnitIds],
  selectedFileIds: [...FINES_API_STATE.selectedFileIds],
  overrideInhibitFileIds: [...FINES_API_STATE.overrideInhibitFileIds],
});

const haveSelectedBusinessUnitsChanged = (currentIds: number[], nextIds: number[]): boolean => {
  if (currentIds.length !== nextIds.length) {
    return true;
  }

  const nextIdSet = new Set(nextIds);
  return currentIds.some((businessUnitId) => !nextIdSet.has(businessUnitId));
};

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
      const businessUnitsChanged = haveSelectedBusinessUnitsChanged(
        store.selectedBusinessUnitIds(),
        selectedBusinessUnitIds,
      );

      patchState(store, {
        selectedBusinessUnitIds: [...selectedBusinessUnitIds],
        ...(businessUnitsChanged && {
          selectedFileIds: [],
          overrideInhibitFileIds: [],
          processInterfaceJobs: null,
          activeTab: FINES_API_STATE.activeTab,
        }),
        stateChanges: true,
        unsavedChanges: selectedBusinessUnitIds.length > 0,
      });
    },
    clearSelectedBusinessUnitIds: () => {
      patchState(store, {
        selectedBusinessUnitIds: [],
        selectedFileIds: [],
        overrideInhibitFileIds: [],
        processInterfaceJobs: null,
        activeTab: FINES_API_PROCESS_ALLOCATE_TABS_KEYS.process,
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
    setProcessInterfaceJobs: (processInterfaceJobs: IOpalFinesInterfaceJobSummary[]) => {
      patchState(store, { processInterfaceJobs: [...processInterfaceJobs] });
    },
    clearProcessInterfaceJobs: () => {
      patchState(store, { processInterfaceJobs: null });
    },
    setOverrideInhibitFileIds: (overrideInhibitFileIds: string[]) => {
      patchState(store, {
        overrideInhibitFileIds: [...overrideInhibitFileIds],
      });
    },
    setActiveTab: (activeTab: TFinesApiProcessAllocateTabKey) => {
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
