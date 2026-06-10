export const FINES_ACC_ENF_ACTION_ADD_MIXED_FIELD_TYPES_RESULT_PARAMETERS_MOCK = JSON.stringify([
  {
    name: 'days',
    prompt: 'Days',
    type: 'integer',
    mandatory: 'false',
    options: null,
  },
  {
    name: 'unknown',
    prompt: 'Unknown',
    type: 'unsupported',
    mandatory: 'false',
    options: null,
  },
  {
    name: 'notes',
    prompt: 'Notes',
    type: 'text',
    max: 1000,
    mandatory: 'false',
    options: null,
  },
  {
    name: 'selection',
    prompt: 'Selection',
    type: 'menu',
    mandatory: 'false',
    options: {
      A: 'Option A',
    },
  },
]);
