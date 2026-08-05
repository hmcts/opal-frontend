import { ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';
import { IFinesReportsSummaryListState } from '../interfaces/fines-reports-summary-list-state.interface';

export const FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS = 'all';

export const FINES_REPORTS_SUMMARY_LIST_STATE: IFinesReportsSummaryListState = {
  reportTypeId: null,
  filters: {
    businessUnit: FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS,
    ...ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
  },
  appliedQuery: null,
};
