import { IAbstractReportSummaryListFilterState } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/interfaces';

export interface IFinesReportsSummaryListFilterState extends IAbstractReportSummaryListFilterState {
  businessUnit: string;
}
