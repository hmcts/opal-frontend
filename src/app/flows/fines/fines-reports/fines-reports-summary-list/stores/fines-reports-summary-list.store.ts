import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';
import { FINES_REPORTS_SUMMARY_LIST_FILTER_STATE } from '../constants/fines-reports-summary-list-filter-state.constant';
import { IFinesReportsSummaryListQueryState } from '../interfaces/fines-reports-summary-list-query-state.interface';

interface FinesReportsSummaryListState {
  filters: IFinesReportsSummaryListFilterState;
  appliedQuery: IFinesReportsSummaryListQueryState | null;
  currentPage: number;
}

export const FinesReportsSummaryListStore = signalStore(
  { providedIn: 'root' },
  withState<FinesReportsSummaryListState>(() => ({
    filters: { ...FINES_REPORTS_SUMMARY_LIST_FILTER_STATE },
    appliedQuery: null,
    currentPage: 1,
  })),
  withMethods((store) => ({
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
        filters: { ...FINES_REPORTS_SUMMARY_LIST_FILTER_STATE },
        appliedQuery: null,
        currentPage: 1,
      });
    },
  })),
);
