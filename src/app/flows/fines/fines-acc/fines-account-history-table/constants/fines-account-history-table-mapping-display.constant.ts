import { IFinesAccountHistoryTableMappingDisplay } from '../interfaces/fines-account-history-table-mapping-display.interface';

export const FINES_ACCOUNT_HISTORY_TABLE_MAPPING_DISPLAY: IFinesAccountHistoryTableMappingDisplay = {
  currencySanitisePattern: /[£,]/g,
  dateFormat: {
    input: 'dd/MM/yyyy',
    output: 'dd/MM/yyyy',
  },
  detailsLineSeparator: ' ',
  emptyDetailsText: '',
  fieldPathSeparator: '.',
  fragmentJoiner: '',
  zeroAmount: 0,
  partSeparator: ' | ',
  windowTarget: '_blank',
};
