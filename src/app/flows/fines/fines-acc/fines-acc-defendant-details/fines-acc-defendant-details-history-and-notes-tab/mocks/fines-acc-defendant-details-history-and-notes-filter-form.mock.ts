import { IOpalFinesDefendantAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-history-params.interface';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK: IFinesAccDefendantDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: '01/01/2024',
      dateTo: '31/01/2024',
      categories: {
        amendments: true,
        documents: false,
        enforcementActions: false,
        financial: false,
        notes: true,
        paymentTerms: false,
      },
    },
    nestedFlow: false,
  };

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK: IFinesAccDefendantDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: '01/01/2024',
      dateTo: '31/01/2024',
      categories: {
        amendments: true,
        documents: true,
        enforcementActions: true,
        financial: true,
        notes: false,
        paymentTerms: true,
      },
    },
    nestedFlow: false,
  };

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK: IFinesAccDefendantDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: null,
      dateTo: null,
      categories: {
        amendments: false,
        documents: false,
        enforcementActions: false,
        financial: false,
        notes: false,
        paymentTerms: false,
      },
    },
    nestedFlow: false,
  };

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK: IOpalFinesDefendantAccountHistoryParams =
  {
    dateFrom: '01/01/2024',
    dateTo: '31/01/2024',
    itemTypes: 'amendments,enforcements,transactions,paymentTerms',
  };

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_PAYLOAD_MOCK: IOpalFinesDefendantAccountHistoryParams =
  {
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    itemTypes: 'amendments,enforcements,transactions,paymentTerms',
  };

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK: IOpalFinesDefendantAccountHistoryParams =
  {
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    itemTypes: 'amendments,notes',
  };
