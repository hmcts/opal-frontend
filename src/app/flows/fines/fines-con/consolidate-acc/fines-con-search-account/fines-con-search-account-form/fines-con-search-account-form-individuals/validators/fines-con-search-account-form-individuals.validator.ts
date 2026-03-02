import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createConditionalRequiredValidator } from 'src/app/flows/fines/validators/conditional-required.validator';
import { ConditionalRequiredRuleConfig } from 'src/app/flows/fines/validators/interfaces/conditional-required-rule-config.interface';

/**
 * Cross-field validator for Individuals search criteria conditional required rules.
 *
 * Rules:
 * - Last name is required when first names, DOB, address, post code, last-name exact match,
 *   or include aliases are provided.
 * - First names is required when first-names exact match is checked.
 */
export const finesConSearchAccountFormIndividualsValidator: ValidatorFn = ((
  control: AbstractControl,
): ValidationErrors | null => {
  const rules: ConditionalRequiredRuleConfig[] = [
    {
      dependentField: 'fcon_search_account_individuals_last_name',
      triggerFields: [
        'fcon_search_account_individuals_first_names',
        'fcon_search_account_individuals_date_of_birth',
        'fcon_search_account_individuals_address_line_1',
        'fcon_search_account_individuals_post_code',
        'fcon_search_account_individuals_last_name_exact_match',
        'fcon_search_account_individuals_include_aliases',
      ],
    },
    {
      dependentField: 'fcon_search_account_individuals_first_names',
      triggerFields: ['fcon_search_account_individuals_first_names_exact_match'],
    },
  ];

  return createConditionalRequiredValidator(rules)(control);
}) as ValidatorFn;
