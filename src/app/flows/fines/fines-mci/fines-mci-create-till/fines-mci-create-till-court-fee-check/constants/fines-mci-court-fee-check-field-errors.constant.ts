import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MCI_COURT_FEE_CHECK_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  suspenseNote: {
    required: { message: 'Enter a suspense note', priority: 1 },
    maxlength: { message: 'Suspense note must be 1,000 characters or fewer', priority: 2 },
  },
};
