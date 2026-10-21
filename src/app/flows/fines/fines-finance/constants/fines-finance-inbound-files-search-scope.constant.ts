import { FinesFinanceInterfaceFileSource } from './fines-finance-interface-file-source.constant';
import { InterfaceFileViewerFileStatus } from './fines-finance-interface-file-status.constant';
import { InterfaceFileViewerSupportedDomain } from './fines-finance-interface-file-domain.constant';
import { FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS } from './fines-finance-inbound-files-type-options.constant';

export const FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE = {
  domain: InterfaceFileViewerSupportedDomain.Fines,
  target: FinesFinanceInterfaceFileSource.Opal,
  not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
  type: FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS.map((option) => option.value),
};
