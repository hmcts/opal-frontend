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

type CombinedCriteriaState = {
  hasAccountTypeRow: boolean;
  hasActionDateRow: boolean;
};

const getReportTypeRow = (key: string, reportType: string): FinesReportsReportSummaryNamedValue | null => {
  return key === FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportType
    ? { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType, value: reportType }
    : null;
};

/**
 * Creates rows that are formed from multiple API parameters, ensuring each combined row is shown once.
 */
const getCombinedCriteriaRow = (
  reportParameters: Record<string, unknown>,
  key: string,
  dateService: DateService,
  state: CombinedCriteriaState,
): FinesReportsReportSummaryNamedValue | null => {
  if (!state.hasActionDateRow) {
    const actionDateRow = buildActionDateRow(reportParameters, key, dateService);

    if (actionDateRow) {
      state.hasActionDateRow = true;
      return actionDateRow;
    }
  }

  if (!state.hasAccountTypeRow && isAccountTypeParameter(key)) {
    const accountTypeRow = buildAccountTypeRow(reportParameters);

    if (accountTypeRow) {
      state.hasAccountTypeRow = true;
    }

    return accountTypeRow;
  }

  return null;
};

/**
 * Maps one report parameter, handling the combined display rows before regular one-to-one mappings.
 */
const mapCriteriaParameter = (
  reportParameters: Record<string, unknown>,
  key: string,
  value: unknown,
  reportType: string,
  enforcementAction: IOpalFinesResultRefData | null,
  enforcementActionCode: unknown,
  dateService: DateService,
  combinedCriteriaState: CombinedCriteriaState,
): FinesReportsReportSummaryNamedValue | null => {
  return (
    getReportTypeRow(key, reportType) ??
    getCombinedCriteriaRow(reportParameters, key, dateService, combinedCriteriaState) ??
    mapOperationalReportParameter(key, value, enforcementAction, enforcementActionCode, dateService)
  );
};

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
  const combinedCriteriaState: CombinedCriteriaState = {
    hasAccountTypeRow: false,
    hasActionDateRow: false,
  };

  for (const [key, value] of Object.entries(parameters)) {
    const row = mapCriteriaParameter(
      parameters,
      key,
      value,
      reportType,
      enforcementAction,
      enforcementActionCode,
      dateService,
      combinedCriteriaState,
    );

    if (row) {
      rows.push(row);
    }
  }

  return mapCriteriaRows(rows);
};
