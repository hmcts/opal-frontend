import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesReportsSummaryListTableWrapperTableSort extends IAbstractSortState {
  'Date and time': SortDirectionType;
  Title: SortDirectionType;
  'Business unit': SortDirectionType;
  'Created by': SortDirectionType;
  Status: SortDirectionType;
}
