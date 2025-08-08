import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { IFinesSaResultsDefendantTableWrapperTableData } from './fines-sa-results-defendant-table-wrapper-table-data.interface';

export type IFinesSaResultsDefendantTableWrapperTableSort = IAbstractSortState & {
  [K in keyof IFinesSaResultsDefendantTableWrapperTableData]: SortDirectionType;
};
