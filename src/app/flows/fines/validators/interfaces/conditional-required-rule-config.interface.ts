/**
 * Configuration for conditional required validation rules.
 */
export interface ConditionalRequiredRuleConfig {
  /** Field that becomes required when one of the trigger fields has a value */
  dependentField: string;
  /** Fields that trigger the dependent field to become required */
  triggerFields: string[];
}
