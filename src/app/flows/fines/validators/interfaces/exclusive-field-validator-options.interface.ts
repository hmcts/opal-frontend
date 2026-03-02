/**
 * Configuration options for exclusive field validator behaviour.
 */
export interface ExclusiveFieldValidatorOptions {
  criteriaPaths: string[] | null;
  emptyErrorKey: string | null;
  multipleErrorKey: string | null;
}
