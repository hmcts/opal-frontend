import { IAbstractSortState } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';

export interface IFinesDraftTableWrapperTableSort extends IAbstractSortState {
  account: 'ascending' | 'descending' | 'none';
  defendant: 'ascending' | 'descending' | 'none';
  dob: 'ascending' | 'descending' | 'none';
  createdString: 'ascending' | 'descending' | 'none';
  accountType: 'ascending' | 'descending' | 'none';
  businessUnit: 'ascending' | 'descending' | 'none';
}
