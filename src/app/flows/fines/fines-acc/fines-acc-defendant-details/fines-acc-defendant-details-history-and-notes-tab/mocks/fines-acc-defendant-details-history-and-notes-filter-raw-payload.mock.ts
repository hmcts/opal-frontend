import { IOpalFinesDefendantAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-history-params.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK: IOpalFinesDefendantAccountHistoryParams =
  {
    dateFrom: '01/01/2024',
    dateTo: '31/01/2024',
    itemTypes: 'amendments,enforcements,transactions,paymentTerms',
  };
