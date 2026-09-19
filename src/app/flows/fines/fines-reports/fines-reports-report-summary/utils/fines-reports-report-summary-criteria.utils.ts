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

/**
 * Builds the report-type criterion when the current key identifies it.
 *
 * @param key - The API parameter key being mapped.
 * @param reportType - The resolved report-type display label.
 * @returns The report-type row, or null when the key identifies another parameter.
 */
const getReportTypeRow = (key: string, reportType: string): FinesReportsReportSummaryNamedValue | null => {
  return key === FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportType
    ? { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType, value: reportType }
    : null;
};

/**
 * Creates rows that are formed from multiple API parameters, ensuring each combined row is shown once.
 *
 * @param reportParameters - The report parameter values supplied by the API.
 * @param key - The API parameter key being mapped.
 * @param dateService - The shared service used to parse and format dates.
 * @param state - Mutable flags recording emitted date and account-type rows; updated when a combined row is created.
 * @returns The next combined criterion, or null when no applicable row remains to be emitted.
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
 *
 * @param reportParameters - The report parameter values supplied by the API.
 * @param key - The API parameter key being mapped.
 * @param value - The API value associated with the parameter key.
 * @param reportType - The resolved report-type display label.
 * @param enforcementAction - The resolved enforcement action reference data, or null when unavailable.
 * @param dateService - The shared service used to parse and format dates.
 * @param combinedCriteriaState - Mutable flags used to emit each combined date or account-type row once.
 * @returns The first applicable report-type, combined or individual criterion, or null when none applies.
 */
const mapCriteriaParameter = (
  reportParameters: Record<string, unknown>,
  key: string,
  value: unknown,
  reportType: string,
  enforcementAction: IOpalFinesResultRefData | null,
  dateService: DateService,
  combinedCriteriaState: CombinedCriteriaState,
): FinesReportsReportSummaryNamedValue | null => {
  const enforcementActionCode = reportParameters[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementAction];

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
 *
 * @param reportParameters - The API report parameters; null or undefined is treated as an empty object.
 * @param reportType - The resolved report-type display label.
 * @param enforcementAction - The resolved enforcement action reference data, or null when unavailable.
 * @param dateService - The shared service used to parse and format dates.
 * @returns Formatted criteria rows in source-parameter order, with related parameters combined and unused values omitted.
 */
export const mapReportSummaryCriteria = (
  reportParameters: Record<string, unknown> | null | undefined,
  reportType: string,
  enforcementAction: IOpalFinesResultRefData | null,
  dateService: DateService,
) => {
  const parameters = reportParameters ?? {};
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
      dateService,
      combinedCriteriaState,
    );

    if (row) {
      rows.push(row);
    }
  }

  return mapCriteriaRows(rows);
};
