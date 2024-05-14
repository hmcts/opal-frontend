import { IFieldError } from './field-error.interface';

export interface IFieldErrors {
  [key: string]: IFieldError;
}
