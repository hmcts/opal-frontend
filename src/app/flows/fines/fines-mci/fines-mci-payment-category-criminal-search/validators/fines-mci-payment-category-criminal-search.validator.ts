import { createConditionalRequiredValidator } from '@app/flows/fines/validators/conditional-required.validator';
import { createExclusiveFieldValidator } from '@app/flows/fines/validators/exclusive-field.validator';

/**
 * Requires a last name when first names, exact last-name matching or aliases are supplied,
 * and requires first names when exact first-name matching is selected.
 * Uses field-level required errors so the search form displays its existing messages.
 */
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

/** Requires a company name when exact company-name matching or alias searching is selected. */
export const finesMciPaymentCategoryCriminalSearchCompaniesValidator = createConditionalRequiredValidator([
  {
    dependentField: 'fsa_search_account_companies_company_name',
    triggerFields: [
      'fsa_search_account_companies_company_name_exact_match',
      'fsa_search_account_companies_include_aliases',
    ],
  },
]);

/**
 * Distinguishes an empty form from combined quick/advanced criteria at form level.
 * The component keeps empty searches on the page and routes combined criteria to the conflict outcome.
 */
export const finesMciPaymentCategoryCriminalSearchOneCriteriaValidator = createExclusiveFieldValidator([], {
  criteriaPaths: [
    'fsa_search_account_number',
    'fsa_search_account_individuals_search_criteria',
    'fsa_search_account_companies_search_criteria',
  ],
  emptyErrorKey: 'formEmpty',
  multipleErrorKey: 'searchCriteriaCannotBeCombined',
});
