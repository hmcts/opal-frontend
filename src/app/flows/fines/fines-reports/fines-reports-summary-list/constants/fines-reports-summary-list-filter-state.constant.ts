import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';

export const FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS = 'all';

export const FINES_REPORTS_SUMMARY_LIST_FILTER_STATE: IFinesReportsSummaryListFilterState = {
  businessUnit: FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
  dateFilter: 'last7Days',
  days: '',
  dateFrom: '',
  dateTo: '',
};
