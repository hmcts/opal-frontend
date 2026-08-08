import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
import { type IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS } from '../constants/fines-reports-report-summary-parameter-keys.constant';
import { type IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { formatReportTypeDisplay } from './fines-reports-report-summary-criteria-value.utils';
import { mapReportSummaryCriteria } from './fines-reports-report-summary-criteria.utils';
import { mapReportSummaryErrors } from './fines-reports-report-summary-error.utils';
import { mapReportSummaryGeneral, normaliseReportSummaryStatus } from './fines-reports-report-summary-general.utils';

/**
 * Maps a backend report instance response into the view model consumed by the report summary component.
 * Status is normalised once here so the General and Errors sections apply the same lifecycle rule,
 * while each section mapper remains responsible only for its own display data.
 */
export const mapFinesReportsReportInstanceToViewModel = (
  reportInstance: IOpalFinesReportInstanceDetail,
  enforcementAction: IOpalFinesResultRefData | null = null,
  reportTitle = '',
  dateService: DateService,
): IFinesReportsReportSummaryViewModel => {
  const status = normaliseReportSummaryStatus(reportInstance.status.code);
  const reportType = formatReportTypeDisplay(
    reportInstance.report_parameters?.[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportType],
    reportInstance.report.id,
  );

  return {
    reportId: reportInstance.report.id,
    reportTitle,
    reportName: reportInstance.name.trim() || reportInstance.report.id,
    reportType,
    general: mapReportSummaryGeneral(reportInstance, status, dateService),
    criteriaRows: mapReportSummaryCriteria(
      reportInstance.report_parameters,
      reportType,
      enforcementAction,
      dateService,
    ),
    errorRows: mapReportSummaryErrors(reportInstance.errors, status),
  };
};
