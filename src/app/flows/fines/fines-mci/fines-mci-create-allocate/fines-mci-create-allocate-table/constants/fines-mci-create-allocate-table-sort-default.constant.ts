import { FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT } from './fines-mci-create-allocate-table-content.constant';
import { IFinesMciCreateAllocateTableSort } from '../interfaces/fines-mci-create-allocate-table-sort.interface';

export const FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT: IFinesMciCreateAllocateTableSort = {
  [FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT.columns.tillNumber]: 'none',
  [FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT.columns.payments]: 'none',
  [FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT.columns.amount]: 'none',
  [FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT.columns.businessUnit]: 'none',
  [FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT.columns.createdBy]: 'none',
  [FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT.columns.dateCreated]: 'descending',
};
