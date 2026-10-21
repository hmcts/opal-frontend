import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FinesFinanceInterfaceFileSource } from './fines-finance-interface-file-source.constant';

export const FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS = [
  { name: 'Allpay', value: FinesFinanceInterfaceFileSource.Allpay },
  { name: 'Allpay DD', value: FinesFinanceInterfaceFileSource.AllpayDd },
  { name: 'NatWest', value: FinesFinanceInterfaceFileSource.Natwest },
  { name: 'Barclaycard', value: FinesFinanceInterfaceFileSource.Barclaycard },
  { name: 'BT Eckoh', value: FinesFinanceInterfaceFileSource.Bteckoh },
  { name: 'DWP', value: FinesFinanceInterfaceFileSource.Dwp },
  { name: 'Cder', value: FinesFinanceInterfaceFileSource.Cder },
  { name: 'Marston', value: FinesFinanceInterfaceFileSource.Marston },
  { name: 'Jacobs', value: FinesFinanceInterfaceFileSource.Jacobs },
  { name: 'BT Eckoh Report', value: FinesFinanceInterfaceFileSource.BteckohReport },
  { name: 'CAPS Report', value: FinesFinanceInterfaceFileSource.CapsReport },
] satisfies IAlphagovAccessibleAutocompleteItem[];
