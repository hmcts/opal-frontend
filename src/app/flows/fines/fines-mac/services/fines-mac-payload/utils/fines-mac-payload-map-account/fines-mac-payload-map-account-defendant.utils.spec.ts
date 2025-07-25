import { finesMacPayloadMapAccountDefendant } from './fines-mac-payload-map-account-defendant.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';

import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../mocks/fines-mac-payload-add-account.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-parent-guardian-complete.mock';
import { IFinesMacParentGuardianDetailsState } from '../../../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-parent-guardian-details-state.mock';

import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-complete.mock';
import { FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-company-details-state.mock';
import { IFinesMacCompanyDetailsState } from '../../../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK } from '../mocks/fines-mac-payload-account-defendant-individual-complete.mock';
import { IFinesMacPersonalDetailsState } from '../../../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-personal-details-state.mock';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../../../constants/fines-mac-defendant-types-keys';

describe('finesMacPayloadMapAccountDefendant', () => {
  let mappedFinesMacState: IFinesMacState | null;
  let parentGuardianDetailsState: IFinesMacParentGuardianDetailsState | null;
  let companyDetailsState: IFinesMacCompanyDetailsState | null;
  let personalDetailsState: IFinesMacPersonalDetailsState | null;
  beforeEach(() => {
    mappedFinesMacState = structuredClone(FINES_MAC_STATE);
    parentGuardianDetailsState = structuredClone(FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK);
    companyDetailsState = structuredClone(FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK);
    personalDetailsState = structuredClone(FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK);
  });

  afterAll(() => {
    mappedFinesMacState = null;
    parentGuardianDetailsState = null;
    companyDetailsState = null;
    personalDetailsState = null;
  });

  it('should map parentOrGuardianToPay defendant type correctly', () => {
    if (!mappedFinesMacState || !parentGuardianDetailsState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account);
    payload.defendant_type = FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay;
    payload.defendant = FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK;

    const result = finesMacPayloadMapAccountDefendant(mappedFinesMacState, payload);

    parentGuardianDetailsState.fm_parent_guardian_details_add_alias = false;
    parentGuardianDetailsState.fm_parent_guardian_details_aliases = [];

    expect(result.parentGuardianDetails.formData).toEqual(parentGuardianDetailsState);
  });

  it('should map company defendant type correctly', () => {
    if (!mappedFinesMacState || !companyDetailsState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account);
    payload.defendant_type = FINES_MAC_DEFENDANT_TYPES_KEYS.company;
    payload.defendant = FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK;
    const result = finesMacPayloadMapAccountDefendant(mappedFinesMacState, payload);

    companyDetailsState.fm_company_details_add_alias = false;
    companyDetailsState.fm_company_details_aliases = [];

    expect(result.companyDetails.formData).toEqual(companyDetailsState);
  });

  it('should map individual defendant type correctly by default', () => {
    if (!mappedFinesMacState || !personalDetailsState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT.account);
    payload.defendant_type = 'individual';
    payload.defendant = FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK;

    const result = finesMacPayloadMapAccountDefendant(mappedFinesMacState, payload);

    personalDetailsState.fm_personal_details_add_alias = false;
    personalDetailsState.fm_personal_details_aliases = [];

    expect(result.personalDetails.formData).toEqual(personalDetailsState);
  });
});
