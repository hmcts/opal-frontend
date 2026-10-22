import { InterfaceFileViewerSupportedDomain } from '../../constants/fines-finance-interface-file-domain.constant';
import { FinesFinanceInterfaceFileSource } from '../../constants/fines-finance-interface-file-source.constant';
import { InterfaceFileViewerFileStatus } from '../../constants/fines-finance-interface-file-status.constant';

export const FINES_FINANCE_OUTBOUND_FILES_SEARCH_SCOPE = {
  domain: InterfaceFileViewerSupportedDomain.Fines,
  source: FinesFinanceInterfaceFileSource.Opal,
  not_target: FinesFinanceInterfaceFileSource.Opal,
  not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
};
