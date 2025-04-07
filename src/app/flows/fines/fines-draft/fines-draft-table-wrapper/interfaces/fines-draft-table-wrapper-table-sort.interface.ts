import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract';
import { SortDirectionType } from '@hmcts/opal-frontend-common/types';

export interface IFinesDraftTableWrapperTableSort extends IAbstractSortState {
  Account: SortDirectionType;
  Defendant: SortDirectionType;
  'Date of birth': SortDirectionType;
  Created: SortDirectionType;
  CreatedAgo: SortDirectionType;
  'Account type': SortDirectionType;
  'Business unit': SortDirectionType;
}
