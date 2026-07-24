import { IFinesReportsSummaryListFilterState } from './fines-reports-summary-list-filter-state.interface';
import { IFinesReportsSummaryListQueryState } from './fines-reports-summary-list-query-state.interface';

export interface IFinesReportsSummaryListState {
  reportTypeId: string | null;
  filters: IFinesReportsSummaryListFilterState;
  appliedQuery: IFinesReportsSummaryListQueryState | null;
}
