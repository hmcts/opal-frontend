import { type IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS } from '../constants/fines-reports-report-summary-criteria-labels.constant';
import { type FinesReportsReportSummaryNamedValue } from '../types/fines-reports-report-summary-named-value.type';
import {
  buildAccountTypeRow,
  buildActionDateRow,
  mapCriteriaRows,
  mapOperationalReportParameter,
} from './fines-reports-report-summary-criteria-value.utils';

/**
 * Sets the fixed screen order for criteria shared by both operational report types.
 */
const OPERATIONAL_REPORT_COMMON_PARAMETER_KEYS = [
  'accountStatus',
  'collectionOrderChoice',
  'minBalance',
  'maxBalance',
  'firstPaymentOrPayByInNext7Days',
  'lowerNameRange',
  'upperNameRange',
] as const;

/**
 * Sets the fixed screen order for criteria used by payment operational reports.
 */
const OPERATIONAL_PAYMENT_PARAMETER_KEYS = [
  'isPaymentMade',
  'reportMode',
  'sinceLastEnforcementAction',
  'sinceDate',
] as const;

/**
 * Adds known criteria values to a row list in the order supplied by the caller.
 */
const appendOperationalReportParameterRows = (
  rows: FinesReportsReportSummaryNamedValue[],
  reportParameters: Record<string, unknown>,
  parameterKeys: readonly string[],
  enforcementAction: IOpalFinesResultRefData | null,
): void => {
  for (const key of parameterKeys) {
    const row = mapOperationalReportParameter(
      key,
      reportParameters[key],
      enforcementAction,
      reportParameters['enforcementAction'],
    );

    if (row) {
      rows.push(row);
    }
  }
};

/**
 * Builds operational-report criteria in the fixed order shown in the report-summary design.
 */
export const mapReportSummaryCriteria = (
  reportParameters: Record<string, unknown> | null | undefined,
  reportType: string,
  enforcementAction: IOpalFinesResultRefData | null,
) => {
  const parameters = reportParameters ?? {};
  const rows: FinesReportsReportSummaryNamedValue[] = [
    { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType, value: reportType },
  ];
  const reportEnforcementMode = parameters['reportEnforcementMode'];
  const enforcementModeRow =
    typeof reportEnforcementMode === 'string' && reportEnforcementMode.trim().length > 0
      ? mapOperationalReportParameter(
          'reportEnforcementMode',
          reportEnforcementMode,
          enforcementAction,
          parameters['enforcementAction'],
        )
      : null;

  if (enforcementModeRow) {
    rows.push(enforcementModeRow);

    const actionDateRow = buildActionDateRow(parameters);
    if (actionDateRow) {
      rows.push(actionDateRow);
    }
  } else {
    appendOperationalReportParameterRows(rows, parameters, OPERATIONAL_PAYMENT_PARAMETER_KEYS, enforcementAction);
  }

  const accountTypeRow = buildAccountTypeRow(parameters);
  if (accountTypeRow) {
    rows.push(accountTypeRow);
  }

  appendOperationalReportParameterRows(rows, parameters, OPERATIONAL_REPORT_COMMON_PARAMETER_KEYS, enforcementAction);

  return mapCriteriaRows(rows);
};
