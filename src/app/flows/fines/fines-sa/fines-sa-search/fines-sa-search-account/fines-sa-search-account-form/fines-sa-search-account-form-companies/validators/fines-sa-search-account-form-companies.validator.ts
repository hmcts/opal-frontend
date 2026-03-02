import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createConditionalRequiredValidator } from 'src/app/flows/fines/validators/conditional-required.validator';
import { ConditionalRequiredRuleConfig } from 'src/app/flows/fines/validators/interfaces/conditional-required-rule-config.interface';

/**
 * Cross-field validator for SA Companies search criteria conditional required rules.
 *
 * Rules:
 * - Company name is required when company-name exact match or include aliases is selected.
 */
export const finesSaSearchAccountFormCompaniesValidator: ValidatorFn = ((
  control: AbstractControl,
): ValidationErrors | null => {
  const rules: ConditionalRequiredRuleConfig[] = [
    {
      dependentField: 'fsa_search_account_companies_company_name',
      triggerFields: [
        'fsa_search_account_companies_company_name_exact_match',
        'fsa_search_account_companies_include_aliases',
      ],
    },
  ];

  return createConditionalRequiredValidator(rules)(control);
}) as ValidatorFn;
