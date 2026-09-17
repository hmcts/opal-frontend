import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesMciCreateAllocateTableData extends IAbstractTableData<SortableValuesType> {
  tillId: string;
  'Till number': string;
  Payments: number;
  Amount: number;
  'Business unit': string;
  'Created by': string;
  'Date created': number;
  dateCreatedDisplay: string;
}
