import { IAbstractTableData } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
import { SortableValues } from '@services/sort-service/types/sort-service-type';

export interface IFinesDraftTableWrapperTableData extends IAbstractTableData<SortableValues> {
  Account: string;
  'Defendant id': number;
  Defendant: string;
  'Date of birth': string | null;
  Created: number;
  CreatedDate: string;
  'Account type': string;
  'Business unit': string;
}
