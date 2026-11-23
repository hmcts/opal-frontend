import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesMciCreateAllocateTableData extends IAbstractTableData<SortableValuesType> {
  tillId: string;
  'Till number': number;
  Payments: number | null;
  Amount: number | null;
  'Business unit': string;
  'Created by': string | null;
  'Date created': number | null;
  dateCreatedDisplay: string;
}
