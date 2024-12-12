import { IAbstractTableData } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
import { SortableValues } from '@services/sort-service/types/sort-service-type';

export interface IFinesDraftTableWrapperTableData extends IAbstractTableData<SortableValues> {
  account: string;
  defendantId: number;
  defendant: string;
  dob: string;
  created: string;
  accountType: string;
  businessUnit: string;
}
