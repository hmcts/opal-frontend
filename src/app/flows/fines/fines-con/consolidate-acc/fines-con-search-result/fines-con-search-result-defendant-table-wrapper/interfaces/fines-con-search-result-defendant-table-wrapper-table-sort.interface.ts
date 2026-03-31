import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { IFinesConSearchResultDefendantTableWrapperTableData } from './fines-con-search-result-defendant-table-wrapper-table-data.interface';

export type IFinesConSearchResultDefendantTableWrapperTableSort = IAbstractSortState & {
  [K in keyof IFinesConSearchResultDefendantTableWrapperTableData]: SortDirectionType;
};
