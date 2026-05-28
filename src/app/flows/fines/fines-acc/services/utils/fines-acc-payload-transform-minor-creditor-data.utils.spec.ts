import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
import { transformMinorCreditorAccountPayload } from './fines-acc-payload-transform-minor-creditor-data.utils';

describe('transformMinorCreditorAccountPayload', () => {
  it('should map company minor creditor data with BACS details into amend form state', () => {
    const minorCreditorData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);

    const result = transformMinorCreditorAccountPayload(minorCreditorData);

    expect(result).toEqual({
      facc_minor_creditor_creditor_type: 'company',
      facc_minor_creditor_title: null,
      facc_minor_creditor_forenames: null,
      facc_minor_creditor_surname: null,
      facc_minor_creditor_company_name: 'Test Organisation',
      facc_minor_creditor_address_line_1: '123 Main Street',
      facc_minor_creditor_address_line_2: 'Apt 4',
      facc_minor_creditor_address_line_3: null,
      facc_minor_creditor_address_line_4: null,
      facc_minor_creditor_address_line_5: null,
      facc_minor_creditor_post_code: 'AB12 3CD',
      facc_minor_creditor_pay_by_bacs: true,
      facc_minor_creditor_bank_account_name: 'Test Account',
      facc_minor_creditor_bank_sort_code: '123456',
      facc_minor_creditor_bank_account_number: '12345678',
      facc_minor_creditor_bank_account_reference: 'REF-001',
    });
  });

  it('should map individual minor creditor data without BACS details into amend form state', () => {
    const minorCreditorData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);
    minorCreditorData.party_details = {
      party_id: 'PARTY-001',
      organisation_flag: false,
      organisation_details: null,
      individual_details: {
        title: 'Mr',
        forenames: 'John',
        surname: 'smith',
        date_of_birth: null,
        age: null,
        national_insurance_number: null,
        individual_aliases: null,
      },
    };
    minorCreditorData.address.postcode = 'ab12 3cd';
    minorCreditorData.payment.pay_by_bacs = false;

    const result = transformMinorCreditorAccountPayload(minorCreditorData);

    expect(result).toEqual({
      facc_minor_creditor_creditor_type: 'individual',
      facc_minor_creditor_title: 'Mr',
      facc_minor_creditor_forenames: 'John',
      facc_minor_creditor_surname: 'SMITH',
      facc_minor_creditor_company_name: null,
      facc_minor_creditor_address_line_1: '123 Main Street',
      facc_minor_creditor_address_line_2: 'Apt 4',
      facc_minor_creditor_address_line_3: null,
      facc_minor_creditor_address_line_4: null,
      facc_minor_creditor_address_line_5: null,
      facc_minor_creditor_post_code: 'AB12 3CD',
      facc_minor_creditor_pay_by_bacs: false,
      facc_minor_creditor_bank_account_name: null,
      facc_minor_creditor_bank_sort_code: null,
      facc_minor_creditor_bank_account_number: null,
      facc_minor_creditor_bank_account_reference: null,
    });
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
