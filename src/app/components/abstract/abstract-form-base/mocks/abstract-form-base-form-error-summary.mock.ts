import { IAbstractFormBaseFormError } from '../interfaces/abstract-form-base-form-error.interface';

export const ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK: IAbstractFormBaseFormError[] = [
  {
    fieldId: 'court',
    message: 'Select a court',
    priority: 1,
    type: 'required',
  },
  {
    fieldId: 'dayOfMonth',
    message: 'The date your passport was issued must include a day',
    priority: 1,
    type: 'required',
  },
  {
    fieldId: 'monthOfYear',
    message: 'The date your passport was issued must include a month',
    priority: 1,
    type: 'required',
  },
  {
    fieldId: 'year',
    message: 'The date your passport was issued must include a year',
    priority: 1,
    type: 'required',
  },
];
