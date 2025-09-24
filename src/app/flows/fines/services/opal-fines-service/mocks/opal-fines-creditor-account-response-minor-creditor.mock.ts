import { IOpalFinesMinorCreditorAccountsResponse } from '../interfaces/opal-fines-minor-creditors-accounts.interface';

export const OPAL_FINES_CREDITOR_ACCOUNTS_RESPONSE_MOCK: IOpalFinesMinorCreditorAccountsResponse = {
  count: 30,
  creditor_accounts: [
    {
      organisation: true,
      creditor_account_id: '1',
      account_number: 'ORG1001',
      address_line_1: '1 Corporate Way',
      postcode: 'CORP1 AB',
      business_unit_name: 'Corporate Unit',
      business_unit_id: 'BU_ORG_1',
      defendant_account_id: 'DA_ORG_1',
      account_balance: 1000.0,
      organisation_name: 'Global Corp Ltd.',
      firstnames: null,
      surname: null,
      defendant: {
        organisation_name: 'Global Corp Ltd.',
        firstnames: null,
        surname: null,
      },
    },
    {
      organisation: false,
      creditor_account_id: '2',
      account_number: 'IND1002',
      address_line_1: '2 Residential Rd',
      postcode: 'RES2 XY',
      business_unit_name: 'Individual Unit',
      business_unit_id: 'BU_IND_2',
      defendant_account_id: 'DA_IND_2',
      account_balance: 200.5,
      organisation_name: null,
      firstnames: 'Jane',
      surname: 'DOE',
      defendant: {
        organisation_name: null,
        firstnames: 'Jane',
        surname: 'DOE',
      },
    },
    ...Array.from({ length: 30 }, (_, i) => {
      const idx = i + 3;
      const isOrganisation = idx % 2 === 0;
      return {
        organisation: isOrganisation,
        creditor_account_id: `${idx}`,
        account_number: `CRD100${idx}`,
        address_line_1: `${idx} Credit Street`,
        postcode: `AB${idx} 1CD`,
        business_unit_name: `Unit ${idx}`,
        business_unit_id: `BU${idx}`,
        defendant_account_id: `DA${idx}`,
        account_balance: 100.0 + idx * 10,
        firstnames: isOrganisation ? null : `First${idx}`,
        surname: isOrganisation ? null : `LAST_${idx}`,
        organisation_name: isOrganisation ? `ORG_${idx}` : null,
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
      };
    }),
  ],
};
