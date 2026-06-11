import { describe, expect, it } from 'vitest';
import { buildHistoryFilterPayload } from './fines-acc-payload-build-history-filter.utils';
import {
  FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK,
  FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK,
  FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK,
} from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/mocks/fines-acc-defendant-details-history-and-notes-filter-form.mock';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';

describe('buildHistoryFilterPayload', () => {
  it('should build raw history filter query params from selected mapped categories and dates', () => {
    const result = buildHistoryFilterPayload(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK);

    expect(result).toEqual(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK);
  });

  it('should omit empty history filter params', () => {
    const result = buildHistoryFilterPayload(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK);

    expect(result).toEqual({});
  });

  it('should omit selected categories without an item type mapping', () => {
    const form: IFinesAccDefendantDetailsHistoryAndNotesFilterForm = {
      formData: {
        dateFrom: null,
        dateTo: null,
        categories: {
          amendments: false,
          documents: true,
          enforcementActions: false,
          financial: false,
          notes: false,
          paymentTerms: false,
        },
      },
      nestedFlow: false,
    };

    const result = buildHistoryFilterPayload(form);

    expect(result).toEqual({});
  });
});
