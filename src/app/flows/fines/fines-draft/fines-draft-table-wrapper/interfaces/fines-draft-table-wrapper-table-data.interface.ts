import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValues } from '@hmcts/opal-frontend-common/types';

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
