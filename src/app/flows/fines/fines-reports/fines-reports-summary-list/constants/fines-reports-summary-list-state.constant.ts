import { IFinesReportsSummaryListState } from '../interfaces/fines-reports-summary-list-state.interface';
import { FINES_REPORTS_SUMMARY_LIST_FILTER_STATE } from './fines-reports-summary-list-filter-state.constant';

export const FINES_REPORTS_SUMMARY_LIST_STATE: IFinesReportsSummaryListState = {
  reportTypeId: null,
  filters: { ...FINES_REPORTS_SUMMARY_LIST_FILTER_STATE },
  appliedQuery: null,
  currentPage: 1,
};
