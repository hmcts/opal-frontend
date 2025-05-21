import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesDraftTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  Account: string;
  ChangedDate: string;
  Changed: number;
  'Defendant id': number;
  Defendant: string;
  'Date of birth': string | null;
  Created: number;
  CreatedDate: string;
  'Account type': string;
  'Business unit': string;
}
