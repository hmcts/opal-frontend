import { IOpalFinesMinorCreditorAccountsResponse } from '../interfaces/opal-fines-minor-creditors-accounts.interface';

export const OPAL_FINES_MINOR_CREDITOR_ACCOUNTS_RESPONSE_MOCK: IOpalFinesMinorCreditorAccountsResponse = {
  count: 20,
  creditor_accounts: Array.from({ length: 20 }, (_, i) => {
    const idx = i + 1;
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
      surname: isOrganisation ? null : `Last${idx}`,
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
            surname: `Last${idx}`,
          },
    };
  }),
};
