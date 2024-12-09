import { finesMacPayloadMapAccountDefendantCompanyPayload } from './fines-mac-payload-map-account-defendant-company.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-company-complete.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-company.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK } from '../fines-mac-payload-build-account/mocks/fines-mac-payload-account-defendant-company-complete-with-aliases.mock';

describe('finesMacPayloadMapAccountDefendantCompanyPayload', () => {
  let initialState: IFinesMacState;

  beforeEach(() => {
    initialState = FINES_MAC_STATE;
  });

  it('should map payload to fines MAC state', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete =
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK;

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);

    expect(result.companyDetails.formData.fm_company_details_organisation_name).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.organisation_name,
    );
    expect(result.companyDetails.formData.fm_company_details_address_line_1).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.address_line_1,
    );
    expect(result.companyDetails.formData.fm_company_details_address_line_2).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.address_line_2,
    );
    expect(result.companyDetails.formData.fm_company_details_address_line_3).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.address_line_3,
    );
    expect(result.companyDetails.formData.fm_company_details_postcode).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.post_code,
    );
    expect(result.contactDetails.formData.fm_contact_details_telephone_number_home).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.telephone_number_home,
    );
    expect(result.contactDetails.formData.fm_contact_details_telephone_number_business).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.telephone_number_business,
    );
    expect(result.contactDetails.formData.fm_contact_details_telephone_number_mobile).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.telephone_number_mobile,
    );
    expect(result.contactDetails.formData.fm_contact_details_email_address_1).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.email_address_1,
    );
    expect(result.contactDetails.formData.fm_contact_details_email_address_2).toBe(
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.email_address_2,
    );
  });

  it('should handle debtor detail if available', () => {
    const payload: IFinesMacPayloadBuildAccountDefendantComplete =
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK;

    const result = finesMacPayloadMapAccountDefendantCompanyPayload(initialState, payload);
    const alias =
      FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK?.debtor_detail?.aliases?.[0]
        .alias_company_name;

    expect(result.companyDetails.formData.fm_company_details_add_alias).toBe(true);
    if (alias) {
      expect(result.companyDetails.formData.fm_company_details_aliases).toEqual([
        { fm_company_details_alias_organisation_name_0: alias },
      ]);
    }
  });
});
