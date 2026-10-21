import type { IFinesFinanceInboundFilesForm } from '../services/interfaces/fines-finance-inbound-files-form.interface';
import { ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';

export const FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE: IFinesFinanceInboundFilesForm = {
  ...ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
  businessUnit: null,
  source: null,
  fileType: null,
};
