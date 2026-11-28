import { ABSTRACT_REPORT_SUMMARY_LIST_STATUS } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';

export const FINES_REPORTS_REPORT_SUMMARY_STATUSES = {
  ...ABSTRACT_REPORT_SUMMARY_LIST_STATUS,
  error: 'ERROR',
} as const;
