export const SEARCH_TYPE_RADIOS = [
  {
    inputName: 'searchType',
    inputClasses: null,
    inputId: 'defendant',
    inputValue: 'defendant',
    inputLabel: 'Defendant',
    inputTextDivider: null,
    inputHint: null,
    conditional: {
      inputName: 'conditionalOne',
      inputClasses: 'govuk-!-width-one-third',
      inputId: 'conditionalOne',
      inputLabel: 'ConditionalOne',
    },
  },
  {
    inputName: 'searchType',
    inputClasses: null,
    inputId: 'minor-creditor',
    inputValue: 'minor creditor',
    inputLabel: 'Minor Creditor',
    inputTextDivider: null,
    inputHint: null,
    conditional: {
      inputName: 'conditionalTwo',
      inputClasses: 'govuk-!-width-one-third',
      inputId: 'conditionalTwo',
      inputLabel: 'ConditionalTwo',
    },
  },
];
