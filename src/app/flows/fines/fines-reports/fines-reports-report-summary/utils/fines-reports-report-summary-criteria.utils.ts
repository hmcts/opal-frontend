import { type IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS } from '../constants/fines-reports-report-summary-criteria-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS } from '../constants/fines-reports-report-summary-parameter-keys.constant';
import { type FinesReportsReportSummaryNamedValue } from '../types/fines-reports-report-summary-named-value.type';
import {
  buildAccountTypeRow,
  buildActionDateRow,
  isAccountTypeParameter,
  mapCriteriaRows,
  mapOperationalReportParameter,
} from './fines-reports-report-summary-criteria-value.utils';

/**
 * Builds operational-report criteria in the order their source parameters are received from the API.
 * Date-pair and account-type properties are the exceptions: each represents one combined design
 * row, which is emitted once at the position of that group's first parameter. Unrecognised and
 * technical supporting parameters do not produce a raw row.
 */
export const mapReportSummaryCriteria = (
  reportParameters: Record<string, unknown> | null | undefined,
  reportType: string,
  enforcementAction: IOpalFinesResultRefData | null,
  dateService: DateService,
) => {
  const parameters = reportParameters ?? {};
  const enforcementActionCode = parameters[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementAction];
  const rows: FinesReportsReportSummaryNamedValue[] = [];
  let hasAccountTypeRow = false;
  let hasActionDateRow = false;

  for (const [key, value] of Object.entries(parameters)) {
    if (key === FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportType) {
      rows.push({ name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType, value: reportType });
      continue;
    }

    // A from/to pair is shown once, rather than as two implementation-detail rows.
    if (!hasActionDateRow) {
      const actionDateRow = buildActionDateRow(parameters, key, dateService);
      if (actionDateRow) {
        rows.push(actionDateRow);
        hasActionDateRow = true;
        continue;
      }
    }

    // Several boolean flags form the single Account type row in the design.
    if (!hasAccountTypeRow && isAccountTypeParameter(key)) {
      const accountTypeRow = buildAccountTypeRow(parameters);
      if (accountTypeRow) {
        rows.push(accountTypeRow);
        hasAccountTypeRow = true;
      }
      continue;
    }

    const row = mapOperationalReportParameter(key, value, enforcementAction, enforcementActionCode, dateService);
    if (row) {
      rows.push(row);
    }
  }

  return mapCriteriaRows(rows);
};
