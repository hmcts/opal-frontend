import { IAbstractFormBaseFieldError } from './abstract-form-base-field-error.interface';

export interface IAbstractFormBaseFieldErrors {
  [key: string]: IAbstractFormBaseFieldError;
}
