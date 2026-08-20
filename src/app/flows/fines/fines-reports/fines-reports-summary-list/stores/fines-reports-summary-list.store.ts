import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IFinesReportsSummaryListState } from '../interfaces/fines-reports-summary-list-state.interface';
import { FINES_REPORTS_SUMMARY_LIST_STATE } from '../constants/fines-reports-summary-list-state.constant';
import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';
import { IFinesReportsSummaryListQueryState } from '../interfaces/fines-reports-summary-list-query-state.interface';

const getFinesReportsSummaryListState = (): IFinesReportsSummaryListState => ({
  ...FINES_REPORTS_SUMMARY_LIST_STATE,
  filters: { ...FINES_REPORTS_SUMMARY_LIST_STATE.filters },
});

export const FinesReportsSummaryListStore = signalStore(
  { providedIn: 'root' },
  withState<IFinesReportsSummaryListState>(() => getFinesReportsSummaryListState()),
  withMethods((store) => ({
    setReportTypeId: (reportTypeId: string | null) => {
      patchState(store, { reportTypeId });
    },
    resetForReportType: (reportTypeId: string | null) => {
      if (store.reportTypeId() === reportTypeId) {
        return;
      }

      patchState(store, {
        ...getFinesReportsSummaryListState(),
        reportTypeId,
      });
    },
    setFilters: (filters: IFinesReportsSummaryListFilterState) => {
      patchState(store, { filters });
    },
    setAppliedQuery: (appliedQuery: IFinesReportsSummaryListQueryState) => {
      patchState(store, { appliedQuery });
    },
    resetFilters: () => {
      patchState(store, getFinesReportsSummaryListState());
    },
  })),
);
