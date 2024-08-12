export interface IAbstractFormBaseFormError {
  fieldId: string;
  message: string | null;
  priority: number;
  type: string | null;
}
