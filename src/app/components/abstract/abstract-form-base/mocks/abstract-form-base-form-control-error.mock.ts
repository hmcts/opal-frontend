import { IAbstractFormBaseFieldError } from '../interfaces/abstract-form-base-field-error.interface';

export const ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK: IAbstractFormBaseFieldError = {
  required: { priority: 2, message: 'Required error' },
  minLength: { priority: 1, message: 'Min length error' },
};
