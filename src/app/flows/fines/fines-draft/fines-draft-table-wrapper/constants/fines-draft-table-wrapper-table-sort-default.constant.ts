import { IFinesDraftTableWrapperTableSort } from '../interfaces/fines-draft-table-wrapper-table-sort.interface';

export const FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT: IFinesDraftTableWrapperTableSort = {
  Account: 'none',
  Defendant: 'none',
  'Date of birth': 'none',
  Created: 'none',
  CreatedDate: 'ascending',
  Changed: 'none',
  ChangedDate: 'none',
  'Account type': 'none',
  'Business unit': 'none',
};

export const FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED: IFinesDraftTableWrapperTableSort = {
  Account: 'none',
  Defendant: 'none',
  'Date of birth': 'none',
  Created: 'none',
  CreatedDate: 'none',
  Changed: 'none',
  ChangedDate: 'ascending',
  'Account type': 'none',
  'Business unit': 'none',
  'Submitted by': 'none',
};
