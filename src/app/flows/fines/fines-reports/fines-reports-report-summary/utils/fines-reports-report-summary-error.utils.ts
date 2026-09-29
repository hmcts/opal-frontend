import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { type IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { type FinesReportsReportSummaryNormalisedStatus } from '../types/fines-reports-report-summary-normalised-status.type';
import { isUnusedOptionalValue, mapDisplayText } from './fines-reports-report-summary-display-value.utils';

const ERROR_DESCRIPTION_LABEL = 'Error Description';
const ERROR_DESCRIPTION_FIELDS = ['error', 'error_description', 'report_generation_error'];

/**
 * Expands a JSON-encoded array into description rows in the supplied order, without the error names.
 *
 * @param value - The error field value received from the API.
 * @returns The named error rows, or null when the original field value should be displayed instead.
 */
const parseNamedErrorRows = (value: unknown): IFinesReportsReportSummaryViewModel['errorRows'] | null => {
  if (typeof value !== 'string') {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return null;
  }

  const entries: unknown[] = parsed;
  const rows: IFinesReportsReportSummaryViewModel['errorRows'] = [];
  for (const entry of entries) {
    if (
      typeof entry !== 'object' ||
      entry === null ||
      !('name' in entry) ||
      typeof entry.name !== 'string' ||
      !('value' in entry) ||
      typeof entry.value !== 'string'
    ) {
      return null;
    }

    rows.push({ key: ERROR_DESCRIPTION_LABEL, value: entry.value });
  }

  return rows;
};

/**
 * Maps error descriptions only when a report instance has the Error status. JSON-encoded name/value
 * arrays become individual description rows. Operation IDs and other metadata are excluded.
 *
 * @param errors - The API error objects, or null or undefined when no errors are supplied.
 * @param status - The normalised report lifecycle status.
 * @returns Non-empty error rows for Error status, or an empty array for other statuses or missing errors.
 */
export const mapReportSummaryErrors = (
  errors: Array<Record<string, unknown>> | null | undefined,
  status: FinesReportsReportSummaryNormalisedStatus,
): IFinesReportsReportSummaryViewModel['errorRows'] => {
  if (status !== FINES_REPORTS_REPORT_SUMMARY_STATUSES.error) {
    return [];
  }

  return (errors ?? []).flatMap((error) =>
    Object.entries(error)
      .filter(([key, value]) => ERROR_DESCRIPTION_FIELDS.includes(key) && !isUnusedOptionalValue(value))
      .flatMap(
        ([, value]) => parseNamedErrorRows(value) ?? [{ key: ERROR_DESCRIPTION_LABEL, value: mapDisplayText(value) }],
      ),
  );
};
