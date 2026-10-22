import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FinesFinanceInboundFileType } from './fines-finance-inbound-file-type.constant';

export const FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS = [
  { name: 'RAW', value: FinesFinanceInboundFileType.Source },
  { name: 'TRANSFORMED', value: FinesFinanceInboundFileType.TransformedJson },
] satisfies IAlphagovAccessibleAutocompleteItem[];
