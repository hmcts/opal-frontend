import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccDefendantDetailsHistoryAndNotesFilterFieldErrors extends IAbstractFormBaseFieldErrors {
  dateFrom: IAbstractFormBaseFieldError;
  dateTo: IAbstractFormBaseFieldError;
}
