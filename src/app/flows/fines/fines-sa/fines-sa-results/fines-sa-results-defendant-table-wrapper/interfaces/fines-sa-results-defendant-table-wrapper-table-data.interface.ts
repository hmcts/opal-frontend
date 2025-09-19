import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesSaResultsDefendantTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  'Account ID': number | null;
  Account: string | null;
  Name: string | null;
  Aliases: string | null;
  'Date of birth': string | null;
  'Address line 1': string | null;
  Postcode: string | null;
  'NI number': string | null;
  'Parent or guardian': string | null;
  'Business unit': string | null;
  Ref: string | null;
  Enf: string | null;
  Balance: number | null;
}
