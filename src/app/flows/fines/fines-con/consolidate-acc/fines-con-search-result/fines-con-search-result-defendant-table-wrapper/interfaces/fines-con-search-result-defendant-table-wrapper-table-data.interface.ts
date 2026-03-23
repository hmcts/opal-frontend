import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesConSearchResultDefendantTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  'Account ID': number | null;
  Account: string | null;
  Name: string | null;
  Aliases: string | null;
  'Date of birth': string | null;
  'Address line 1': string | null;
  Postcode: string | null;
  CO: string | null;
  ENF: string | null;
  Balance: number | null;
  'P/G': string | null;
  'NI number': string | null;
  Ref: string | null;
}
