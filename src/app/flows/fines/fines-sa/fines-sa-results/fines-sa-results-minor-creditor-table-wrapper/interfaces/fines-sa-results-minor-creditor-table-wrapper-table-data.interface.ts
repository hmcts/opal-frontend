import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';

export interface IFinesSaResultsMinorCreditorTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  'Creditor account id': number | null;
  Account: string | null;
  Name: string | null;
  'Address line 1': string | null;
  Postcode: string | null;
  'Business unit': string | null;
  'Defendant account id': number | null;
  Defendant: string | null;
  Balance: number | null;
}
