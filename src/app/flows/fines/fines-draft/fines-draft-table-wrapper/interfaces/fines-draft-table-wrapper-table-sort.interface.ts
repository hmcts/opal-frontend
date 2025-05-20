import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesDraftTableWrapperTableSort extends IAbstractSortState {
  Account: SortDirectionType;
  Defendant: SortDirectionType;
  'Date of birth': SortDirectionType;
  Created: SortDirectionType;
  CreatedDate: SortDirectionType;
  'Account type': SortDirectionType;
  'Business unit': SortDirectionType;
}
