export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY = {
  currencySanitisePattern: /[£,]/g,
  detailsLineSeparator: ' ',
  emptyDetailsText: '',
  fieldPathSeparator: '.',
  fragmentJoiner: '',
  govukDatePattern: /^(\d{2})\/(\d{2})\/(\d{4})$/,
  govukDateTimeSuffix: 'T00:00:00.000Z',
  zeroAmount: 0,
  partSeparator: ' | ',
  windowTarget: '_blank',
} as const;
