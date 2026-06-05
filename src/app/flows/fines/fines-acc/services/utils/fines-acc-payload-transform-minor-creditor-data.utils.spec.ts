import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_INDIVIDUAL_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor-individual.mock';
import { MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_FORM } from '../../fines-acc-minor-creditor-add-amend-convert/mocks/fines-acc-minor-creditor-add-amend-convert-company-form.mock';
import { MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_FORM } from '../../fines-acc-minor-creditor-add-amend-convert/mocks/fines-acc-minor-creditor-add-amend-convert-individual-form.mock';
import { transformMinorCreditorAccountPayload } from './fines-acc-payload-transform-minor-creditor-data.utils';

describe('transformMinorCreditorAccountPayload', () => {
  it('should map company minor creditor data with BACS details into amend form state', () => {
    const minorCreditorData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);

    const result = transformMinorCreditorAccountPayload(minorCreditorData);

    expect(result).toEqual(MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_COMPANY_FORM.formData);
  });

  it('should map individual minor creditor data without BACS details into amend form state', () => {
    const minorCreditorData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_INDIVIDUAL_MOCK);

    const result = transformMinorCreditorAccountPayload(minorCreditorData);

    expect(result).toEqual(MOCK_FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_INDIVIDUAL_FORM.formData);
  });

  it('should map missing optional values to null', () => {
    const minorCreditorData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);
    minorCreditorData.party_details.organisation_details = null;
    minorCreditorData.address.address_line_1 = '';
    minorCreditorData.address.address_line_2 = null;
    minorCreditorData.address.address_line_3 = null;
    minorCreditorData.address.address_line_4 = null;
    minorCreditorData.address.address_line_5 = null;
    minorCreditorData.address.postcode = null;
    minorCreditorData.payment.account_name = '';
    minorCreditorData.payment.sort_code = '';
    minorCreditorData.payment.account_number = '';
    minorCreditorData.payment.account_reference = '';

    const result = transformMinorCreditorAccountPayload(minorCreditorData);

    expect(result.facc_minor_creditor_company_name).toBeNull();
    expect(result.facc_minor_creditor_address_line_1).toBeNull();
    expect(result.facc_minor_creditor_address_line_2).toBeNull();
    expect(result.facc_minor_creditor_address_line_3).toBeNull();
    expect(result.facc_minor_creditor_address_line_4).toBeNull();
    expect(result.facc_minor_creditor_address_line_5).toBeNull();
    expect(result.facc_minor_creditor_post_code).toBeNull();
    expect(result.facc_minor_creditor_bank_account_name).toBeNull();
    expect(result.facc_minor_creditor_bank_sort_code).toBeNull();
    expect(result.facc_minor_creditor_bank_account_number).toBeNull();
    expect(result.facc_minor_creditor_bank_account_reference).toBeNull();
  });
});
