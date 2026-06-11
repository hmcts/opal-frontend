import { IOpalFinesDefendantAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-history-params.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK: IOpalFinesDefendantAccountHistoryParams =
  {
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    itemTypes: 'amendments,notes',
  };
