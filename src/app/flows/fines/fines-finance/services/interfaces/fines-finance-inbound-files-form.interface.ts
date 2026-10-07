export type FinesFinanceInboundFilesDateFilter = 'last7Days' | 'customDays' | 'dateRange';

export interface IFinesFinanceInboundFilesForm {
  businessUnit: string | null;
  dateFilter: FinesFinanceInboundFilesDateFilter | null;
  days: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  fileType: string | null;
  source: string | null;
}
