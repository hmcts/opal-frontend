import { IFinesApiProcessFilesTableWrapperTableSort } from '../interfaces/fines-api-process-files-table-wrapper-table-sort.interface';
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT } from './fines-api-process-files-table-wrapper-content.constant';

export const FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT: IFinesApiProcessFilesTableWrapperTableSort = {
  [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.fileName]: 'none',
  [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.source]: 'none',
  [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.businessUnit]: 'none',
  [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.dateUploaded]: 'none',
};
