import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';

const buildImposition = (
  impositionId: number,
  creditor: IOpalFinesAccountDefendantDetailsImpositionsTabRefData['impositions'][number]['creditor'],
): IOpalFinesAccountDefendantDetailsImpositionsTabRefData['impositions'][number] => ({
  date_added: '2026-01-01',
  imposition: { result_id: 'COMP', result_title: 'Compensation' },
  creditor,
  imposed_amount: 100,
  paid_amount: 0,
  balance: 100,
  date_imposed: '2026-01-01',
  offence: { offence_title: 'Example offence' },
  imposed_by: null,
  imposition_id: impositionId,
});

export const IMPOSITION_CREDITOR_NAMES_MOCK: IOpalFinesAccountDefendantDetailsImpositionsTabRefData = {
  version: null,
  impositions: [
    buildImposition(101, {
      creditor_account_id: 101,
      creditor_account_type: { account_type: 'MN', display_name: 'Minor Creditor' },
      minor_creditor_organisation_flag: true,
      company_name: { organisation_name: 'Example Company Ltd' },
    }),
    buildImposition(102, {
      creditor_account_id: 102,
      creditor_account_type: { account_type: 'MN', display_name: 'Minor Creditor' },
      minor_creditor_organisation_flag: false,
      individual_name: { forenames: 'Example', surname: 'Individual' },
    }),
    buildImposition(103, {
      creditor_account_id: 103,
      creditor_account_type: { account_type: 'MN', display_name: 'Minor Creditor' },
      minor_creditor_organisation_flag: false,
      individual_name: { surname: 'SurnameOnly' },
    }),
    buildImposition(104, {
      creditor_account_id: 104,
      creditor_account_type: { account_type: 'MJ', display_name: 'Major Creditor' },
      major_creditor_name: 'Example Major Creditor',
    }),
    buildImposition(105, {
      creditor_account_id: 105,
      creditor_account_type: { account_type: 'CF', display_name: 'Central Fund' },
    }),
    buildImposition(106, {
      creditor_account_id: 106,
      creditor_account_type: { account_type: 'MN', display_name: 'Minor Creditor' },
      minor_creditor_organisation_flag: true,
      company_name: null,
    }),
  ],
};
