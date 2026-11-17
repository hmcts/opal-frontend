import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { FINES_FPU_STATE } from './constants/fines-fpu-state.constant';
import { IFinesFpuBusinessUnit } from '../interfaces/fines-fpu-business-unit.interface';
import { IFinesFpuState } from './interfaces/fines-fpu-state.interface';

const initialState = (): IFinesFpuState => ({
  ...FINES_FPU_STATE,
  selectedBusinessUnitIds: [],
});

const reconcileSelectedBusinessUnitIds = (
  businessUnits: readonly IFinesFpuBusinessUnit[],
  selectedBusinessUnitIds: readonly number[],
): number[] => {
  const selectedIds = new Set(selectedBusinessUnitIds);
  return businessUnits
    .filter((businessUnit) => selectedIds.has(businessUnit.business_unit_id))
    .map((businessUnit) => businessUnit.business_unit_id);
};

export const FinesFpuStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    businessUnits: computed(() => store.tabData() ?? []),
  })),
  withMethods((store) => ({
    setFragment: (fragment: string) => {
      patchState(store, { fragment });
    },
    setTabData: (tabData: readonly IFinesFpuBusinessUnit[] | null) => {
      if (tabData === null) {
        patchState(store, { tabData: null });
        return;
      }

      patchState(store, {
        tabData: tabData.map((businessUnit) => ({ ...businessUnit })),
        selectedBusinessUnitIds: reconcileSelectedBusinessUnitIds(tabData, store.selectedBusinessUnitIds()),
      });
    },
    setBusinessUnits: (businessUnits: readonly IFinesFpuBusinessUnit[]) => {
      patchState(store, {
        tabData: businessUnits.map((businessUnit) => ({ ...businessUnit })),
        selectedBusinessUnitIds: reconcileSelectedBusinessUnitIds(businessUnits, store.selectedBusinessUnitIds()),
      });
    },
    setSelectedBusinessUnitIds: (selectedBusinessUnitIds: readonly number[]) => {
      patchState(store, {
        selectedBusinessUnitIds: reconcileSelectedBusinessUnitIds(store.businessUnits(), selectedBusinessUnitIds),
      });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
    resetFinesFpuState: () => {
      patchState(store, initialState());
    },
  })),
);
