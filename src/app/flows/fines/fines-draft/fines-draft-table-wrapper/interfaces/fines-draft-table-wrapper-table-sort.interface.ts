import { IAbstractSortState } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
import { SortDirectionType } from '@components/abstract/abstract-sortable-table/types/abstract-sortable-table.type';

export interface IFinesDraftTableWrapperTableSort extends IAbstractSortState {
  Account: SortDirectionType;
  Defendant: SortDirectionType;
  'Date of birth': SortDirectionType;
  Created: SortDirectionType;
  CreatedAgo: SortDirectionType;
  'Account type': SortDirectionType;
  'Business unit': SortDirectionType;
}
