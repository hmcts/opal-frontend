import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
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
  withMethods((store) => ({
    /**
     * Reads the stored business unit selection for the specified report.
     *
     * @param reportTypeId - The report type whose selection is requested.
     * @returns The selected business unit ids, or an empty array when another report owns the selection.
     */
    getSelectedBusinessUnitIdsForReport(reportTypeId: string): number[] {
      return store.selectedReportTypeId() === reportTypeId ? store.selectedBusinessUnitIds() : [];
    },
    /**
     * Checks whether the specified report has a stored business unit selection.
     *
     * @param reportTypeId - The report type to check.
     * @returns Whether this report owns a non-empty business unit selection.
     */
    hasSelectedBusinessUnitsForReport(reportTypeId: string): boolean {
      return store.selectedReportTypeId() === reportTypeId && store.selectedBusinessUnitIds().length > 0;
    },
    /**
     * Replaces the stored selection with a copy of the supplied business unit ids for the report.
     *
     * @param reportTypeId - The report type that owns the selection.
     * @param selectedBusinessUnitIds - The selected business unit ids to store.
     */
    setSelectedBusinessUnitIds(reportTypeId: string, selectedBusinessUnitIds: number[]): void {
      patchState(store, {
        ...FINES_REPORTS_INITIAL_STATE,
        selectedReportTypeId: reportTypeId,
        selectedBusinessUnitIds: [...selectedBusinessUnitIds],
      });
    },
    /**
     * Clears the selected report type and its business unit selection.
     */
    clearSelectedBusinessUnitIds(): void {
      patchState(store, FINES_REPORTS_INITIAL_STATE);
    },
  })),
);
