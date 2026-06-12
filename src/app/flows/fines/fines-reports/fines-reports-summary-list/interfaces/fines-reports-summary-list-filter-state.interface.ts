import { FinesReportsSummaryListDateFilter } from '../types/fines-reports-summary-list-date-filter.type';

export interface IFinesReportsSummaryListFilterState {
  businessUnit: string;
  dateFilter: FinesReportsSummaryListDateFilter;
  days: string;
  dateFrom: string;
  dateTo: string;
}
