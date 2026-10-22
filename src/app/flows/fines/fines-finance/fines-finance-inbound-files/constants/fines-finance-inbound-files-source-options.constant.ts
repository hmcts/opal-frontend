import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FinesFinanceInboundFileSource } from './fines-finance-inbound-file-source.constant';

export const FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS = [
  { name: 'Allpay', value: FinesFinanceInboundFileSource.Allpay },
  { name: 'Allpay DD', value: FinesFinanceInboundFileSource.AllpayDd },
  { name: 'NatWest', value: FinesFinanceInboundFileSource.Natwest },
  { name: 'Barclaycard', value: FinesFinanceInboundFileSource.Barclaycard },
  { name: 'BT Eckoh', value: FinesFinanceInboundFileSource.Bteckoh },
  { name: 'DWP', value: FinesFinanceInboundFileSource.Dwp },
  { name: 'Cder', value: FinesFinanceInboundFileSource.Cder },
  { name: 'Marston', value: FinesFinanceInboundFileSource.Marston },
  { name: 'Jacobs', value: FinesFinanceInboundFileSource.Jacobs },
  { name: 'BT Eckoh Report', value: FinesFinanceInboundFileSource.BteckohReport },
  { name: 'CAPS Report', value: FinesFinanceInboundFileSource.CapsReport },
] satisfies IAlphagovAccessibleAutocompleteItem[];
