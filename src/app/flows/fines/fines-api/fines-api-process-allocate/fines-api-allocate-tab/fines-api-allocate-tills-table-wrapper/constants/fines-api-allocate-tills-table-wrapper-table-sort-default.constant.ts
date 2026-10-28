import { FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT } from './fines-api-allocate-tills-table-wrapper-content.constant';
import { IFinesApiAllocateTillsTableWrapperTableSort } from '../interfaces/fines-api-allocate-tills-table-wrapper-table-sort.interface';

export const FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_TABLE_SORT_DEFAULT: IFinesApiAllocateTillsTableWrapperTableSort = {
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.tillNumber]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.errors]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.fileName]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.source]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.amount]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.businessUnit]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.processedBy]: 'none',
  [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.dateProcessed]: 'none',
};
