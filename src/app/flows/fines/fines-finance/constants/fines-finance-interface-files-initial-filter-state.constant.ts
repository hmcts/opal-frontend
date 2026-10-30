import { ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';
import type { IFinesFinanceInterfaceFilesForm } from '../interfaces/fines-finance-interface-files-form.interface';

export const FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE: IFinesFinanceInterfaceFilesForm = {
  ...ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
  businessUnit: null,
};
