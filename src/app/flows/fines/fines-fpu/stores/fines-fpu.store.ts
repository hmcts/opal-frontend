import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { FINES_FPU_STATE } from './constants/fines-fpu-state.constant';
import { IFinesFpuBusinessUnit } from '../interfaces/fines-fpu-business-unit.interface';
import { IFinesFpuState } from './interfaces/fines-fpu-state.interface';

/**
 * Creates journey defaults with a fresh selection array for each store initialisation or reset.
 *
 * @returns The initial fixed penalty uploads state.
 */
const initialState = (): IFinesFpuState => ({
  ...FINES_FPU_STATE,
  selectedBusinessUnitIds: [],
});

/**
 * Retains selected business units that are still displayed, in table order.
 *
 * @param businessUnits - The currently available business units.
 * @param selectedBusinessUnitIds - Business unit IDs selected before reconciliation.
 * @returns Valid selected business unit IDs in display order.
 */
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
    /**
     * Records the currently active tab.
     *
     * @param fragment - The tab's URL fragment.
     */
    setFragment: (fragment: string) => {
      patchState(store, { fragment });
    },
    /**
     * Replaces tab data and reconciles selections once fresh rows are available.
     *
     * @param tabData - Business unit summaries, or null to hide rows without clearing selections.
     */
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
    /**
     * Sets available business units and removes selections that no longer have tickets.
     *
     * @param businessUnits - The business units available for selection.
     */
    setBusinessUnits: (businessUnits: readonly IFinesFpuBusinessUnit[]) => {
      patchState(store, {
        tabData: businessUnits.map((businessUnit) => ({ ...businessUnit })),
        selectedBusinessUnitIds: reconcileSelectedBusinessUnitIds(businessUnits, store.selectedBusinessUnitIds()),
      });
    },
    /**
     * Stores only selections present in the currently displayed business units.
     *
     * @param selectedBusinessUnitIds - The business unit IDs requested by the form.
     */
    setSelectedBusinessUnitIds: (selectedBusinessUnitIds: readonly number[]) => {
      patchState(store, {
        selectedBusinessUnitIds: reconcileSelectedBusinessUnitIds(store.businessUnits(), selectedBusinessUnitIds),
      });
    },
    /**
     * Records whether leaving the journey requires confirmation.
     *
     * @param unsavedChanges - Whether the journey contains unsaved changes.
     */
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
    /** Clears tab data, selections and leave protection when the journey ends. */
    resetFinesFpuState: () => {
      patchState(store, initialState());
    },
  })),
);
