import { IOpalFinesMinorCreditorAccountsResponse } from '../interfaces/opal-fines-minor-creditors-accounts.interface';

export const OPAL_FINES_CREDITOR_ACCOUNTS_RESPONSE_MOCK: IOpalFinesMinorCreditorAccountsResponse = {
  count: 30,
  creditor_accounts: [
    {
      organisation: true,
      creditor_account_id: 1,
      account_number: 'ORG1001',
      payment: {
        account_number: 'ORG1001',
        account_name: 'Global Corp Ltd.',
        account_reference: 'REF-1',
        sort_code: '112233',
        pay_by_bacs: true,
        hold_payment: false,
      },
      address_line_1: '1 Corporate Way',
      address: {
        address_line_1: '1 Corporate Way',
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: 'CORP1 AB',
      },
      postcode: 'CORP1 AB',
      business_unit_name: 'Corporate Unit',
      business_unit_id: 'BU_ORG_1',
      defendant_account_id: 1,
      account_balance: 1000.0,
      organisation_name: 'Global Corp Ltd.',
      firstnames: null,
      surname: null,
      party_details: {
        party_id: 'P-1',
        organisation_flag: true,
        organisation_details: {
          organisation_name: 'Global Corp Ltd.',
          organisation_aliases: null,
        },
        individual_details: null,
        defendant: {
          organisation_name: 'Global Corp Ltd.',
          firstnames: null,
          surname: null,
        },
      },
    },
    {
      organisation: false,
      creditor_account_id: 2,
      account_number: 'IND1002',
      payment: {
        account_number: 'IND1002',
        account_name: 'Jane DOE',
        account_reference: 'REF-2',
        sort_code: '221133',
        pay_by_bacs: false,
        hold_payment: false,
      },
      address_line_1: '2 Residential Rd',
      address: {
        address_line_1: '2 Residential Rd',
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: 'RES2 XY',
      },
      postcode: 'RES2 XY',
      business_unit_name: 'Individual Unit',
      business_unit_id: 'BU_IND_2',
      defendant_account_id: 2,
      account_balance: 200.5,
      organisation_name: null,
      firstnames: 'Jane',
      surname: 'DOE',
      party_details: {
        party_id: 'P-2',
        organisation_flag: false,
        organisation_details: null,
        individual_details: {
          title: null,
          forenames: 'Jane',
          surname: 'DOE',
          date_of_birth: null,
          age: null,
          national_insurance_number: null,
          individual_aliases: null,
        },
        defendant: {
          organisation_name: null,
          firstnames: 'Jane',
          surname: 'DOE',
        },
      },
    },
    ...Array.from({ length: 30 }, (_, i) => {
      const idx = i + 3;
      const isOrganisation = idx % 2 === 0;
      return {
        organisation: isOrganisation,
        creditor_account_id: idx,
        account_number: `CRD100${idx}`,
        payment: {
          account_number: `CRD100${idx}`,
          account_name: isOrganisation ? `ORG_${idx}` : `First${idx} LAST_${idx}`,
          account_reference: `REF-${idx}`,
          sort_code: '112233',
          pay_by_bacs: idx % 2 === 0,
          hold_payment: false,
        },
        address_line_1: `${idx} Credit Street`,
        address: {
          address_line_1: `${idx} Credit Street`,
          address_line_2: null,
          address_line_3: null,
          address_line_4: null,
          address_line_5: null,
          postcode: `AB${idx} 1CD`,
        },
        postcode: `AB${idx} 1CD`,
        business_unit_name: `Unit ${idx}`,
        business_unit_id: `BU${idx}`,
        defendant_account_id: idx,
        account_balance: 100.0 + idx * 10,
        firstnames: isOrganisation ? null : `First${idx}`,
        surname: isOrganisation ? null : `LAST_${idx}`,
        organisation_name: isOrganisation ? `ORG_${idx}` : null,
        party_details: {
          party_id: `P-${idx}`,
          organisation_flag: isOrganisation,
          organisation_details: isOrganisation
            ? {
                organisation_name: `ORG_${idx}`,
                organisation_aliases: null,
              }
            : null,
          individual_details: isOrganisation
            ? null
            : {
                title: null,
                forenames: `First${idx}`,
                surname: `LAST_${idx}`,
                date_of_birth: null,
                age: null,
                national_insurance_number: null,
                individual_aliases: null,
              },
          defendant: isOrganisation
            ? {
                organisation_name: `ORG_${idx}`,
                firstnames: null,
                surname: null,
              }
            : {
                organisation_name: null,
                firstnames: `First${idx}`,
                surname: `LAST_${idx}`,
              },
        },
      };
    }),
  ],
};
