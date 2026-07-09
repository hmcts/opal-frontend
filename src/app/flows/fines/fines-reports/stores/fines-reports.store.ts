import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IFinesReportsState } from './interfaces/fines-reports-state.interface';

export const FinesReportsStore = signalStore(
  withState<IFinesReportsState>(() => ({
    selectedReportTypeId: null,
    selectedBusinessUnitIds: [],
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
        selectedReportTypeId: reportTypeId,
        selectedBusinessUnitIds: [...selectedBusinessUnitIds],
      });
    },
    clearSelectedBusinessUnitIds(): void {
      patchState(store, {
        selectedReportTypeId: null,
        selectedBusinessUnitIds: [],
      });
    },
  })),
);
