import { describe, expect, it } from 'vitest';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { mapReportSummaryErrors } from './fines-reports-report-summary-error.utils';

describe('mapReportSummaryErrors', () => {
  it('shows the seeded error descriptions in order without their names or operation ID', () => {
    const errors = [
      {
        error: JSON.stringify([
          { name: 'Report query failed.', value: 'The report could not be generated for QA testing.' },
          { name: 'Account data unavailable.', value: 'One or more account records could not be read.' },
        ]),
        operationId: 'REPORT-GENERATION-ERROR',
      },
    ];

    expect(mapReportSummaryErrors(errors, FINES_REPORTS_REPORT_SUMMARY_STATUSES.error)).toEqual([
      { key: 'Error Description', value: 'The report could not be generated for QA testing.' },
      { key: 'Error Description', value: 'One or more account records could not be read.' },
    ]);
  });

  it('does not create error rows from identifiers or other metadata', () => {
    expect(
      mapReportSummaryErrors(
        [{ operationId: 'job-123', id: 'error-456', name: 'Query error', report_service: 'reporting' }],
        FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
      ),
    ).toEqual([]);
  });

  it('uses the same label for plain-text descriptions across error entries', () => {
    expect(
      mapReportSummaryErrors(
        [
          { error: 'Query failed', operationId: 'job-123' },
          { error_description: 'Connection closed' },
          { report_generation_error: 'Report timed out' },
        ],
        FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
      ),
    ).toEqual([
      { key: 'Error Description', value: 'Query failed' },
      { key: 'Error Description', value: 'Connection closed' },
      { key: 'Error Description', value: 'Report timed out' },
    ]);
  });

  it.each([
    'Report query failed.',
    '[{"name":',
    'null',
    '42',
    '{"message":"Connection closed"}',
    '[]',
    '[null]',
    '["Connection closed"]',
    '[{"value":"Missing name"}]',
    '[{"name":42,"value":"Invalid name"}]',
    '[{"name":"Missing value"}]',
    '[{"name":"Invalid value","value":42}]',
    '[{"name":"Valid message","value":"Keep this too"},null]',
  ])('retains the complete description when it is not a named error array: %s', (error) => {
    expect(mapReportSummaryErrors([{ error }], FINES_REPORTS_REPORT_SUMMARY_STATUSES.error)).toEqual([
      { key: 'Error Description', value: error },
    ]);
  });

  it('keeps the existing display of error fields that are not strings', () => {
    expect(
      mapReportSummaryErrors(
        [{ error: { message: 'Connection closed' } }],
        FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
      ),
    ).toEqual([{ key: 'Error Description', value: '{"message":"Connection closed"}' }]);
  });
});
