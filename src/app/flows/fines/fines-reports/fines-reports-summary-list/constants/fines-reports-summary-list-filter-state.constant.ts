import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';

export const FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS = 'all';
export const FINES_REPORTS_SUMMARY_LIST_LAST_7_DAYS = 'last7Days';
export const FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS = 'customDays';
export const FINES_REPORTS_SUMMARY_LIST_DATE_RANGE = 'dateRange';

export const FINES_REPORTS_SUMMARY_LIST_FILTER_STATE: IFinesReportsSummaryListFilterState = {
  businessUnit: FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
  dateFilter: FINES_REPORTS_SUMMARY_LIST_LAST_7_DAYS,
  days: '',
  dateFrom: '',
  dateTo: '',
};
