import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createConditionalRequiredValidator } from 'src/app/flows/fines/validators/conditional-required.validator';
import { ConditionalRequiredRuleConfig } from 'src/app/flows/fines/validators/interfaces/conditional-required-rule-config.interface';

/**
 * Cross-field validator for SA Individuals search criteria conditional required rules.
 *
 * Rules:
 * - Last name is required when first names, DOB, address, post code, last-name exact match,
 *   or include aliases are provided.
 * - First names is required when first-names exact match is checked.
 */
export const finesSaSearchAccountFormIndividualsValidator: ValidatorFn = ((
  control: AbstractControl,
): ValidationErrors | null => {
  const rules: ConditionalRequiredRuleConfig[] = [
    {
      dependentField: 'fsa_search_account_individuals_last_name',
      triggerFields: [
        'fsa_search_account_individuals_first_names',
        'fsa_search_account_individuals_date_of_birth',
        'fsa_search_account_individuals_address_line_1',
        'fsa_search_account_individuals_post_code',
        'fsa_search_account_individuals_last_name_exact_match',
        'fsa_search_account_individuals_include_aliases',
      ],
    },
    {
      dependentField: 'fsa_search_account_individuals_first_names',
      triggerFields: ['fsa_search_account_individuals_first_names_exact_match'],
    },
  ];

  return createConditionalRequiredValidator(rules)(control);
}) as ValidatorFn;
