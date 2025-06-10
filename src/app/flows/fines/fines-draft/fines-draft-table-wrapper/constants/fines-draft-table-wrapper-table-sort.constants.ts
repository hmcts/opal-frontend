import { IFinesDraftTableWrapperTableSort } from '../interfaces/fines-draft-table-wrapper-table-sort.interface';

const FINES_DRAFT_TABLE_WRAPPER_SORT_BASE: IFinesDraftTableWrapperTableSort = {
  Account: 'none',
  Defendant: 'none',
  'Date of birth': 'none',
  Created: 'none',
  CreatedDate: 'none',
  Changed: 'none',
  ChangedDate: 'none',
  'Account type': 'none',
  'Business unit': 'none',
  'Submitted by': 'none',
};

export const FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT: IFinesDraftTableWrapperTableSort = {
  ...FINES_DRAFT_TABLE_WRAPPER_SORT_BASE,
  CreatedDate: 'ascending',
};

export const FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED: IFinesDraftTableWrapperTableSort = {
  ...FINES_DRAFT_TABLE_WRAPPER_SORT_BASE,
  ChangedDate: 'ascending',
};
