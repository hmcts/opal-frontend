import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IFinesReportsSummaryListFilterState } from '../interfaces/fines-reports-summary-list-filter-state.interface';
import { IFinesReportsSummaryListQueryState } from '../interfaces/fines-reports-summary-list-query-state.interface';
import {
  FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
  FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS,
  FINES_REPORTS_SUMMARY_LIST_DATE_RANGE,
} from '../constants/fines-reports-summary-list-filter-state.constant';

const DATE_FORMAT = 'dd/MM/yyyy';
const API_DATE_FORMAT = 'yyyy-MM-dd';

export const finesReportsSummaryListDateFormat = DATE_FORMAT;

export const getDefaultReportsSummaryListQuery = (dateService: DateService): IFinesReportsSummaryListQueryState => {
  const dateRange = dateService.getDateRange(6, 0, API_DATE_FORMAT);

  return {
    fromDate: dateRange.from,
    toDate: dateRange.to,
    businessUnit: null,
  };
};

export const getReportsSummaryListQueryFromFilters = (
  filters: IFinesReportsSummaryListFilterState,
  dateService: DateService,
): IFinesReportsSummaryListQueryState => {
  const businessUnit =
    filters.businessUnit && filters.businessUnit !== FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS
      ? filters.businessUnit
      : null;

  if (filters.dateFilter === FINES_REPORTS_SUMMARY_LIST_CUSTOM_DAYS) {
    const days = Number(filters.days);
    const dateRange = dateService.getDateRange(days - 1, 0, API_DATE_FORMAT);

    return {
      fromDate: dateRange.from,
      toDate: dateRange.to,
      businessUnit,
    };
  }

  if (filters.dateFilter === FINES_REPORTS_SUMMARY_LIST_DATE_RANGE) {
    return {
      fromDate: filters.dateFrom
        ? dateService.getFromFormatToFormat(filters.dateFrom, DATE_FORMAT, API_DATE_FORMAT)
        : null,
      toDate: filters.dateTo ? dateService.getFromFormatToFormat(filters.dateTo, DATE_FORMAT, API_DATE_FORMAT) : null,
      businessUnit,
    };
  }

  return {
    ...getDefaultReportsSummaryListQuery(dateService),
    businessUnit,
  };
};

export const isReportsSummaryListDateInvalid = (value: string, dateService: DateService): boolean => {
  return !dateService.isValidDate(value, DATE_FORMAT);
};

export const isReportsSummaryListDateInFuture = (value: string, dateService: DateService): boolean => {
  return dateService.isValidDate(value, DATE_FORMAT) && dateService.isDateInTheFuture(value, undefined, DATE_FORMAT);
};

export const isReportsSummaryListDateFromAfterDateTo = (
  dateFrom: string,
  dateTo: string,
  dateService: DateService,
): boolean => {
  const from = dateService.getFromFormat(dateFrom, DATE_FORMAT).startOf('day');
  const to = dateService.getFromFormat(dateTo, DATE_FORMAT).startOf('day');
  return from.isValid && to.isValid && from > to;
};
