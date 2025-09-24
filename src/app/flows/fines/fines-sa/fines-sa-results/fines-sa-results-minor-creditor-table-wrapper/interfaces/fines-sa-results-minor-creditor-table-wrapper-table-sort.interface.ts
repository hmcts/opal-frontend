import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { IFinesSaResultsMinorCreditorTableWrapperTableData } from './fines-sa-results-minor-creditor-table-wrapper-table-data.interface';

export type IFinesSaResultsMinorCreditorTableWrapperTableSort = IAbstractSortState & {
  [K in keyof IFinesSaResultsMinorCreditorTableWrapperTableData]: SortDirectionType;
};
