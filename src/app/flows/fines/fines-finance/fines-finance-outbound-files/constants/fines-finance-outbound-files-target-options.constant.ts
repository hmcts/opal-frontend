import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FinesFinanceOutboundFileTarget } from './fines-finance-outbound-file-target.constant';

export const FINES_FINANCE_OUTBOUND_FILES_TARGET_OPTIONS = [
  { name: 'ANT CSV', value: FinesFinanceOutboundFileTarget.AntCsv },
  { name: 'Allpay Out', value: FinesFinanceOutboundFileTarget.AllpayOut },
] satisfies IAlphagovAccessibleAutocompleteItem[];
