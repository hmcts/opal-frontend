import { FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE } from '../../constants/fines-finance-interface-files-initial-filter-state.constant';
import type { IFinesFinanceInboundFilesForm } from '../interfaces/fines-finance-inbound-files-form.interface';

export const FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE: IFinesFinanceInboundFilesForm = {
  ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE,
  source: null,
  fileType: null,
};
