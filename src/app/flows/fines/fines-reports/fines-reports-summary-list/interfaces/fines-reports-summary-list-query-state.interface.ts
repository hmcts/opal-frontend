import { IAbstractReportSummaryListQueryState } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/interfaces';

export interface IFinesReportsSummaryListQueryState extends IAbstractReportSummaryListQueryState {
  businessUnit: string | null;
}
