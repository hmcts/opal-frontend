import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesApiAllocateTillsTableWrapperTableSort extends IAbstractSortState {
  'Till number': SortDirectionType;
  Errors: SortDirectionType;
  Filename: SortDirectionType;
  Source: SortDirectionType;
  Amount: SortDirectionType;
  'Business Unit': SortDirectionType;
  'Processed by': SortDirectionType;
  'Date processed': SortDirectionType;
}
