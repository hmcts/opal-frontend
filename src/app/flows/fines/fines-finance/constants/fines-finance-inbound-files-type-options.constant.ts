import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FinesFinanceInterfaceFileType } from './fines-finance-interface-file-type.constant';

export const FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS = [
  { name: 'RAW', value: FinesFinanceInterfaceFileType.Source },
  { name: 'TRANSFORMED', value: FinesFinanceInterfaceFileType.TransformedJson },
] satisfies IAlphagovAccessibleAutocompleteItem[];
