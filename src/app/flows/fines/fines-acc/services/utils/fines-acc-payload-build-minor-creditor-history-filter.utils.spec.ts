import { describe, expect, it } from 'vitest';
import { buildMinorCreditorHistoryFilterPayload } from './fines-acc-payload-build-minor-creditor-history-filter.utils';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK } from '../../fines-acc-minor-creditor-details/fines-acc-minor-creditor-details-history-and-notes-tab/mocks/fines-acc-minor-creditor-details-history-and-notes-filter-all-form.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK } from '../../fines-acc-minor-creditor-details/fines-acc-minor-creditor-details-history-and-notes-tab/mocks/fines-acc-minor-creditor-details-history-and-notes-filter-empty-form.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK } from '../../fines-acc-minor-creditor-details/fines-acc-minor-creditor-details-history-and-notes-tab/mocks/fines-acc-minor-creditor-details-history-and-notes-filter-raw-payload.mock';

describe('buildMinorCreditorHistoryFilterPayload', () => {
  it('should build raw minor creditor history filter query params from selected mapped categories and dates', () => {
    const result = buildMinorCreditorHistoryFilterPayload(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK,
    );

    expect(result).toEqual(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK);
  });

  it('should omit empty minor creditor history filter params', () => {
    const result = buildMinorCreditorHistoryFilterPayload(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK,
    );

    expect(result).toEqual({});
  });
});
