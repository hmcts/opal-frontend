import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesApiAllocateTillsTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  tillId: string;
  'Till number': number;
  Errors: number;
  Filename: string;
  Source: string;
  Amount: number;
  'Business Unit': string;
  'Processed by': string;
  'Date processed': number;
  dateProcessedDisplay: string;
}
