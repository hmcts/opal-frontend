import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesApiProcessFilesTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  'File name': string;
  Source: string;
  'Business unit': string;
  'Date uploaded': number;
  interfaceJobId: string;
  interfaceFileId: string;
  dateUploadedDisplay: string;
  status: string;
}
