import { IOpalFinesAccountDefendantDetailsHeader } from '../../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesDefendantAccountAlias } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

const INDIVIDUAL_ALIASES: IOpalFinesDefendantAccountAlias[] = [
  { alias_number: 1, organisation_name: null, surname: 'Graham', forenames: 'A.' },
];

const ORGANISATION_ALIASES: IOpalFinesDefendantAccountAlias[] = [
  { alias_number: 1, organisation_name: 'Sainsco Ltd', surname: null, forenames: null },
];

export const DEFENDANT_HEADER_MOCK: IOpalFinesAccountDefendantDetailsHeader = {
  version: '1',
  account_number: '177A',
  defendant_party_id: '77',
  parent_guardian_party_id: null,
  account_status_reference: {
    account_status_code: 'L',
    account_status_display_name: 'Live',
  },
  account_type: 'Fine',
  prosecutor_case_reference: '090A',
  fixed_penalty_ticket_number: '888',
  business_unit_summary: {
    business_unit_id: '77',
    business_unit_name: 'Central London',
    welsh_speaking: 'No',
  },
  payment_state_summary: {
    imposed_amount: 700.58,
    arrears_amount: 0,
    paid_amount: 200.0,
    account_balance: 500.58,
  },
  party_details: {
    party_id: '77',
    organisation_flag: false,
    organisation_details: null,
    individual_details: {
      title: 'Mr',
      forenames: 'Anna',
      surname: 'Graham',
      date_of_birth: '1980-02-03',
      age: '45',
      national_insurance_number: null,
      individual_aliases: INDIVIDUAL_ALIASES,
    },
  },
  is_youth: false,
  debtor_type: 'Defendant',
};

/**
 * Utility to create a custom defendant header mock with overridden forenames and surname.
 */
export function createDefendantHeaderMockWithName(
  forenames: string,
  surname: string,
): IOpalFinesAccountDefendantDetailsHeader {
  return {
    ...DEFENDANT_HEADER_MOCK,
    party_details: {
      ...DEFENDANT_HEADER_MOCK.party_details,
      individual_details: {
        ...DEFENDANT_HEADER_MOCK.party_details?.individual_details!,
        forenames,
        surname,
      },
    },
  };
}

export const DEFENDANT_HEADER_YOUTH_MOCK: IOpalFinesAccountDefendantDetailsHeader = {
  ...DEFENDANT_HEADER_MOCK,
  is_youth: true,
  debtor_type: 'Defendant',
};

export const DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK: IOpalFinesAccountDefendantDetailsHeader = {
  ...DEFENDANT_HEADER_MOCK,
  parent_guardian_party_id: '99',
  debtor_type: 'Parent/Guardian',
};

export const DEFENDANT_HEADER_ORG_MOCK: IOpalFinesAccountDefendantDetailsHeader = {
  ...DEFENDANT_HEADER_MOCK,
  party_details: {
    party_id: '501',
    organisation_flag: true,
    organisation_details: {
      organisation_name: 'Sainsco',
      organisation_aliases: ORGANISATION_ALIASES,
    },
    individual_details: null,
  },
};

export const MOCK_ACCOUNT_STATE = {
  account_number: '177A',
  account_id: 141,
  party_type: 'Individual',
  party_name: 'Anna Graham',
  party_id: '77',
  base_version: '1',
  business_unit_id: '77',
  business_unit_user_id: '10',
  welsh_speaking: 'No',
};

export const USER_STATE_MOCK_NO_PERMISSION: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserNote@HMCTS.NET',
  name: 'Test User',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L077AO',
      business_unit_id: 77,
      permissions: [
        {
          permission_id: 3,
          permission_name: 'Account Enquiry',
        },
        {
          permission_id: 2,
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_id: 5,
          permission_name: 'Check and Validate Draft Accounts',
        },
      ],
    },
  ],
};

export const USER_STATE_MOCK_PERMISSION_BU17: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserNote@HMCTS.NET',
  name: 'Test User',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L017KG',
      business_unit_id: 17,
      permissions: [
        {
          permission_id: 3,
          permission_name: 'Account Enquiry',
        },
        {
          permission_id: 2,
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_id: 5,
          permission_name: 'Check and Validate Draft Accounts',
        },
        {
          permission_id: 8,
          permission_name: 'Add Account Activity Notes',
        },
        {
          permission_id: 7,
          permission_name: 'Account Maintenance',
        },
      ],
    },
  ],
};
export const USER_STATE_MOCK_PERMISSION_BU77: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserNote@HMCTS.NET',
  name: 'Test User',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L077AO',
      business_unit_id: 77,
      permissions: [
        {
          permission_id: 3,
          permission_name: 'Account Enquiry',
        },
        {
          permission_id: 2,
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_id: 5,
          permission_name: 'Check and Validate Draft Accounts',
        },
        {
          permission_id: 8,
          permission_name: 'Add Account Activity Notes',
        },
        {
          permission_id: 7,
          permission_name: 'Account Maintenance',
        },
      ],
    },
  ],
};
