import { IFinesMacCompanyDetailsState } from '../interfaces/fines-mac-company-details-state.interface';

import { FINES_MAC_COMPANY_DETAILS_CONTROLS_COMPANY_NAME as F_M_COMPANY_DETAILS_COMPANY_NAME } from '../constants/controls/fines-mac-company-details-controls-company-name';
import { FINES_MAC_CONTROLS_ADD_ALIAS as F_M_COMPANY_DETAILS_ADD_ALIAS } from '../../constants/controls/fines-mac-controls-add-alias';
import { FINES_MAC_CONTROLS_ALIASES as F_M_COMPANY_DETAILS_ALIASES } from '../../constants/controls/fines-mac-controls-aliases';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE as F_M_COMPANY_DETAILS_ADDRESS_LINE_ONE } from '../../constants/controls/fines-mac-controls-address-line-one';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO as F_M_COMPANY_DETAILS_ADDRESS_LINE_TWO } from '../../constants/controls/fines-mac-controls-address-line-two';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_THREE as F_M_COMPANY_DETAILS_ADDRESS_LINE_THREE } from '../../constants/controls/fines-mac-controls-address-line-three';
import { FINES_MAC_CONTROLS_POSTCODE as F_M_COMPANY_DETAILS_POSTCODE } from '../../constants/controls/fines-mac-controls-postcode';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state';

export const FINES_MAC_COMPANY_DETAILS_STATE_MOCK: IFinesMacFormState = {
  [F_M_COMPANY_DETAILS_COMPANY_NAME.controlName]: 'Acme Org Ltd.',
  [F_M_COMPANY_DETAILS_ADD_ALIAS.controlName]: true,
  [F_M_COMPANY_DETAILS_ALIASES.controlName]: [{ alias_organisation_name_0: 'Boring Co.' }],
  [F_M_COMPANY_DETAILS_ADDRESS_LINE_ONE.controlName]: '123 Street',
  [F_M_COMPANY_DETAILS_ADDRESS_LINE_TWO.controlName]: 'City',
  [F_M_COMPANY_DETAILS_ADDRESS_LINE_THREE.controlName]: 'County',
  [F_M_COMPANY_DETAILS_POSTCODE.controlName]: 'AB12 3CD',
};
