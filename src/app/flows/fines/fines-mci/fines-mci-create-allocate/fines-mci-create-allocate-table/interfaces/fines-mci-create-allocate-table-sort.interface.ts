import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesMciCreateAllocateTableSort extends IAbstractSortState {
  'Till number': SortDirectionType;
  Payments: SortDirectionType;
  Amount: SortDirectionType;
  'Business unit': SortDirectionType;
  'Created by': SortDirectionType;
  'Date created': SortDirectionType;
}
