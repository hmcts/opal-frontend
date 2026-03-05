/**
 * Configuration for exclusive field validation rules.
 */
export interface ExclusiveFieldRuleConfig {
  primaryField: string;
  conflictingFields: string[];
  errorKey: string;
}
