import { describe, expect, it } from 'vitest';
import { buildMajorCreditorHistoryFilterPayload } from './fines-acc-payload-build-major-creditor-history-filter.utils';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from '../../fines-acc-major-creditor-details/fines-acc-major-creditor-details-history-and-notes-tab/mocks/fines-acc-major-creditor-details-history-and-notes-filter-form.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK } from '../../fines-acc-major-creditor-details/fines-acc-major-creditor-details-history-and-notes-tab/mocks/fines-acc-major-creditor-details-history-and-notes-filter-empty-form.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK } from '../../fines-acc-major-creditor-details/fines-acc-major-creditor-details-history-and-notes-tab/mocks/fines-acc-major-creditor-details-history-and-notes-filter-raw-payload.mock';

describe('buildMajorCreditorHistoryFilterPayload', () => {
  it('should build raw major creditor history filter query params from submitted dates', () => {
    const result = buildMajorCreditorHistoryFilterPayload(
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK,
    );

    expect(result).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK);
  });

  it('should omit empty major creditor history filter params', () => {
    const result = buildMajorCreditorHistoryFilterPayload(
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK,
    );

    expect(result).toEqual({});
  });
});
