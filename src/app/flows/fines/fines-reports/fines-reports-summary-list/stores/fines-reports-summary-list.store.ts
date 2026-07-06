import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';
import { FINES_REPORTS_SUMMARY_LIST_FILTER_STATE } from '../constants/fines-reports-summary-list-filter-state.constant';
import { IFinesReportsSummaryListQueryState } from '../interfaces/fines-reports-summary-list-query-state.interface';

interface FinesReportsSummaryListState {
  reportTypeId: string | null;
  filters: IFinesReportsSummaryListFilterState;
  appliedQuery: IFinesReportsSummaryListQueryState | null;
  currentPage: number;
}

export const FinesReportsSummaryListStore = signalStore(
  { providedIn: 'root' },
  withState<FinesReportsSummaryListState>(() => ({
    reportTypeId: null,
    filters: { ...FINES_REPORTS_SUMMARY_LIST_FILTER_STATE },
    appliedQuery: null,
    currentPage: 1,
  })),
  withMethods((store) => ({
    setReportTypeId: (reportTypeId: string | null) => {
      patchState(store, { reportTypeId });
    },
    resetForReportType: (reportTypeId: string | null) => {
      if (store.reportTypeId() === reportTypeId) {
        return;
      }

      patchState(store, {
        reportTypeId,
        filters: { ...FINES_REPORTS_SUMMARY_LIST_FILTER_STATE },
        appliedQuery: null,
        currentPage: 1,
      });
    },
    setFilters: (filters: IFinesReportsSummaryListFilterState) => {
      patchState(store, { filters });
    },
    setAppliedQuery: (appliedQuery: IFinesReportsSummaryListQueryState) => {
      patchState(store, { appliedQuery, currentPage: 1 });
    },
    setCurrentPage: (currentPage: number) => {
      patchState(store, { currentPage });
    },
    resetFilters: () => {
      patchState(store, {
        reportTypeId: null,
        filters: { ...FINES_REPORTS_SUMMARY_LIST_FILTER_STATE },
        appliedQuery: null,
        currentPage: 1,
      });
    },
  })),
);
