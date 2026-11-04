import { createConditionalRequiredValidator } from '@app/flows/fines/validators/conditional-required.validator';
import { createExclusiveFieldValidator } from '@app/flows/fines/validators/exclusive-field.validator';

export const finesMciPaymentCategoryCriminalSearchIndividualsValidator = createConditionalRequiredValidator([
  {
    dependentField: 'fsa_search_account_individuals_last_name',
    triggerFields: [
      'fsa_search_account_individuals_first_names',
      'fsa_search_account_individuals_last_name_exact_match',
      'fsa_search_account_individuals_include_aliases',
    ],
  },
  {
    dependentField: 'fsa_search_account_individuals_first_names',
    triggerFields: ['fsa_search_account_individuals_first_names_exact_match'],
  },
]);

export const finesMciPaymentCategoryCriminalSearchCompaniesValidator = createConditionalRequiredValidator([
  {
    dependentField: 'fsa_search_account_companies_company_name',
    triggerFields: [
      'fsa_search_account_companies_company_name_exact_match',
      'fsa_search_account_companies_include_aliases',
    ],
  },
]);

export const finesMciPaymentCategoryCriminalSearchOneCriteriaValidator = createExclusiveFieldValidator([], {
  criteriaPaths: [
    'fsa_search_account_number',
    'fsa_search_account_individuals_search_criteria',
    'fsa_search_account_companies_search_criteria',
  ],
  emptyErrorKey: 'formEmpty',
  multipleErrorKey: 'searchCriteriaCannotBeCombined',
});
