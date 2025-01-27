import { IAbstractSortState } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';

export interface IFinesDraftTableWrapperTableSort extends IAbstractSortState {
  Account: 'ascending' | 'descending' | 'none';
  Defendant: 'ascending' | 'descending' | 'none';
  'Date of birth': 'ascending' | 'descending' | 'none';
  Created: 'ascending' | 'descending' | 'none';
  'Account type': 'ascending' | 'descending' | 'none';
  'Business unit': 'ascending' | 'descending' | 'none';
}
