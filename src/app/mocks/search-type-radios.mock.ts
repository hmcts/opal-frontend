export const SEARCH_TYPE_RADIOS_MOCK = [
  {
    inputName: 'searchType',
    inputClasses: null,
    inputId: 'defendant',
    inputValue: 'defendant',
    inputLabel: 'Defendant',
    inputTextDivider: 'of',
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
    inputClasses: 'radio-test-class',
    inputId: 'minorCreditor',
    inputValue: 'minor creditor',
    inputLabel: 'Minor Creditor',
    inputTextDivider: null,
    inputHint: 'Hint Hint',
    conditional: {
      inputName: 'conditionalTwo',
      inputClasses: 'govuk-!-width-one-third',
      inputId: 'conditionalTwo',
      inputLabel: 'ConditionalTwo',
    },
  },
];
