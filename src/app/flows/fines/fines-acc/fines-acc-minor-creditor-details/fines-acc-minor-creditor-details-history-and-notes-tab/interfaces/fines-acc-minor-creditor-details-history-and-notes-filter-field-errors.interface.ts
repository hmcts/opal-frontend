import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccMinorCreditorDetailsHistoryAndNotesFilterFieldErrors extends IAbstractFormBaseFieldErrors {
  dateFrom: IAbstractFormBaseFieldError;
  dateTo: IAbstractFormBaseFieldError;
}
