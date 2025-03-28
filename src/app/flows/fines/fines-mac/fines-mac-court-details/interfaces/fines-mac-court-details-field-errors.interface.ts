import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract';

export interface IFinesMacCourtDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_court_details_originator_id: IAbstractFormBaseFieldError;
  fm_court_details_prosecutor_case_reference: IAbstractFormBaseFieldError;
  fm_court_details_imposing_court_id: IAbstractFormBaseFieldError;
}
