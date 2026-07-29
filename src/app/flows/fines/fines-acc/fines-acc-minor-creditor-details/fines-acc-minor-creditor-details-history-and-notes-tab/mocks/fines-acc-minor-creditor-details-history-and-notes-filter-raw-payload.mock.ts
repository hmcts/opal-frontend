import { IOpalFinesMinorCreditorAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-minor-creditor-account-history-params.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_RAW_PAYLOAD_MOCK: IOpalFinesMinorCreditorAccountHistoryParams =
  {
    dateFrom: '01/01/2024',
    dateTo: '31/01/2024',
    itemTypes: 'amendment,note,financial',
  };
