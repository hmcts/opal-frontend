export interface IAbstractFormError {
  fieldId: string;
  message: string | null;
  priority: number;
  type: string | null;
}
