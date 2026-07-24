import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IFinesReportsState } from './interfaces/fines-reports-state.interface';

const FINES_REPORTS_INITIAL_STATE: IFinesReportsState = {
  selectedReportTypeId: null,
  selectedBusinessUnitIds: [],
};

export const FinesReportsStore = signalStore(
  withState<IFinesReportsState>(() => ({
    ...FINES_REPORTS_INITIAL_STATE,
    selectedBusinessUnitIds: [...FINES_REPORTS_INITIAL_STATE.selectedBusinessUnitIds],
  })),
  withComputed((store) => ({
    hasSelectedBusinessUnits: computed(() => store.selectedBusinessUnitIds().length > 0),
  })),
  withMethods((store) => ({
    getSelectedBusinessUnitIdsForReport(reportTypeId: string): number[] {
      return store.selectedReportTypeId() === reportTypeId ? store.selectedBusinessUnitIds() : [];
    },
    hasSelectedBusinessUnitsForReport(reportTypeId: string): boolean {
      return store.selectedReportTypeId() === reportTypeId && store.selectedBusinessUnitIds().length > 0;
    },
    setSelectedBusinessUnitIds(reportTypeId: string, selectedBusinessUnitIds: number[]): void {
      patchState(store, {
        ...FINES_REPORTS_INITIAL_STATE,
        selectedReportTypeId: reportTypeId,
        selectedBusinessUnitIds: [...selectedBusinessUnitIds],
      });
    },
    clearSelectedBusinessUnitIds(): void {
      patchState(store, FINES_REPORTS_INITIAL_STATE);
    },
  })),
);
