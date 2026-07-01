import { DateTime } from 'luxon';
import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';
import { IFinesReportsSummaryListQueryState } from '../interfaces/fines-reports-summary-list-query-state.interface';
import { FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS } from '../constants/fines-reports-summary-list-filter-state.constant';

const DATE_FORMAT = 'dd/MM/yyyy';
const API_DATE_FORMAT = 'yyyy-MM-dd';

export const finesReportsSummaryListDateFormat = DATE_FORMAT;

export const getDefaultReportsSummaryListQuery = (): IFinesReportsSummaryListQueryState => {
  const today = DateTime.now().startOf('day');

  return {
    fromDate: today.minus({ days: 6 }).toFormat(API_DATE_FORMAT),
    toDate: today.toFormat(API_DATE_FORMAT),
    businessUnit: null,
  };
};

export const getReportsSummaryListQueryFromFilters = (
  filters: IFinesReportsSummaryListFilterState,
): IFinesReportsSummaryListQueryState => {
  const today = DateTime.now().startOf('day');
  const businessUnit =
    filters.businessUnit && filters.businessUnit !== FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS
      ? filters.businessUnit
      : null;

  if (filters.dateFilter === 'customDays') {
    const days = Number(filters.days);

    return {
      fromDate: today.minus({ days: days - 1 }).toFormat(API_DATE_FORMAT),
      toDate: today.toFormat(API_DATE_FORMAT),
      businessUnit,
    };
  }

  if (filters.dateFilter === 'dateRange') {
    return {
      fromDate: filters.dateFrom
        ? DateTime.fromFormat(filters.dateFrom, DATE_FORMAT).startOf('day').toFormat(API_DATE_FORMAT)
        : null,
      toDate: filters.dateTo
        ? DateTime.fromFormat(filters.dateTo, DATE_FORMAT).startOf('day').toFormat(API_DATE_FORMAT)
        : null,
      businessUnit,
    };
  }

  return {
    ...getDefaultReportsSummaryListQuery(),
    businessUnit,
  };
};

export const isReportsSummaryListDateInvalid = (value: string): boolean => {
  return !DateTime.fromFormat(value, DATE_FORMAT).isValid;
};

export const isReportsSummaryListDateInFuture = (value: string): boolean => {
  const date = DateTime.fromFormat(value, DATE_FORMAT).startOf('day');
  return date.isValid && date > DateTime.now().startOf('day');
};

export const isReportsSummaryListDateFromAfterDateTo = (dateFrom: string, dateTo: string): boolean => {
  const from = DateTime.fromFormat(dateFrom, DATE_FORMAT).startOf('day');
  const to = DateTime.fromFormat(dateTo, DATE_FORMAT).startOf('day');
  return from.isValid && to.isValid && from > to;
};
