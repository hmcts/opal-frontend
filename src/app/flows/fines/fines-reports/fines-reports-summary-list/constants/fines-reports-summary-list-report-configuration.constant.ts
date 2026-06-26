import { FINES_REPORTS_DEFINITIONS } from '../../constants/fines-reports-definitions.constant';
import { IFinesReportSummaryListReportConfiguration } from '../interfaces/fines-report-summary-list-report-configuration.interface';

export const FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION: IFinesReportSummaryListReportConfiguration[] =
  FINES_REPORTS_DEFINITIONS.map(({ id, heading, title, permissionIds }) => ({
    id,
    heading,
    title,
    permissionIds,
  }));
