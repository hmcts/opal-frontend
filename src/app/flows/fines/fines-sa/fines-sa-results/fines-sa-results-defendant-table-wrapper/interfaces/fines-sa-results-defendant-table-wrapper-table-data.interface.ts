import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesSaResultsDefendantTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  Account: string;
  Name: string;
  Aliases: string | null;
  'Date of birth': string | null;
  'Address line 1': string;
  Postcode: string | null;
  'NI number': string | null;
  'Parent or guardian': string | null;
  'Business unit': string;
  Ref: string | null;
  Enf: string | null;
  Balance: number | null;
}
