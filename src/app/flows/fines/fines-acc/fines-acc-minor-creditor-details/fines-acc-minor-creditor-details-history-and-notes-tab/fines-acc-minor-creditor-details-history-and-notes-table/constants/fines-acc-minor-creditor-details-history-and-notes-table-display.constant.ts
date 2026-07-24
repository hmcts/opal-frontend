export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY = {
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
} as const;
