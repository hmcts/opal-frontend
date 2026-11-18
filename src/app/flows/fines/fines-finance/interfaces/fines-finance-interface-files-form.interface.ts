import type { AbstractReportSummaryListDateFilter } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/types';

export interface IFinesFinanceInterfaceFilesForm {
  businessUnit: string | null;
  dateFilter: AbstractReportSummaryListDateFilter | null;
  days: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}
