import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMacOffenceDetailsSearchOffencesErrors extends IAbstractFormBaseFieldErrors {
  fm_offence_details_search_offences_code: IAbstractFormBaseFieldError;
  fm_offence_details_search_offences_short_title: IAbstractFormBaseFieldError;
  fm_offence_details_search_offences_act_and_section: IAbstractFormBaseFieldError;
}
