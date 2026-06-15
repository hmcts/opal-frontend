import { describe, expect, it } from 'vitest';
import { buildHistoryFilterPayload } from './fines-acc-payload-build-history-filter.utils';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/mocks/fines-acc-defendant-details-history-and-notes-filter-all-form.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/mocks/fines-acc-defendant-details-history-and-notes-filter-empty-form.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/mocks/fines-acc-defendant-details-history-and-notes-filter-raw-payload.mock';

describe('buildHistoryFilterPayload', () => {
  it('should build raw history filter query params from selected mapped categories and dates', () => {
    const result = buildHistoryFilterPayload(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK);

    expect(result).toEqual(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK);
  });

  it('should omit empty history filter params', () => {
    const result = buildHistoryFilterPayload(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK);

    expect(result).toEqual({});
  });
});
