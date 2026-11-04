import { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { FinesMciCriminalAccountId } from '../../../interfaces/fines-mci-criminal-account.interface';

export interface IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData extends IAbstractTableData<SortableValuesType> {
  'Account ID': FinesMciCriminalAccountId | null;
  Account: string | null;
  Name: string | null;
  Aliases: string | null;
  'Date of birth': string | null;
  'Address line 1': string | null;
  Postcode: string | null;
  Balance: number | null;
  Enf: string | null;
  CO: string | null;
}
