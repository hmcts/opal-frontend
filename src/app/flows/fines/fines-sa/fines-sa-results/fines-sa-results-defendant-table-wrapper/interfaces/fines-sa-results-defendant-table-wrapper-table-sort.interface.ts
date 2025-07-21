import { IAbstractSortState } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesSaResultsDefendantTableWrapperTableSort extends IAbstractSortState {
  Account: SortDirectionType;
  Name: SortDirectionType;
  Aliases: SortDirectionType;
  'Date of birth': SortDirectionType;
  'Address line 1': SortDirectionType;
  Postcode: SortDirectionType;
  'NI number': SortDirectionType;
  'Parent or guardian': SortDirectionType;
  'Business unit': SortDirectionType;
  Ref: SortDirectionType;
  Enf: SortDirectionType;
  Balance: SortDirectionType;
}
