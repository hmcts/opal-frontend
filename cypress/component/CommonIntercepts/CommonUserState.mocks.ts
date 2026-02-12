import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

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
        {
          permission_id: 6,
          permission_name: 'Search and view accounts',
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
          permission_id: 6,
          permission_name: 'Search and view accounts',
        },
        {
          permission_id: 8,
          permission_name: 'Add Account Activity Notes',
        },
        {
          permission_id: 7,
          permission_name: 'Account Maintenance',
        },
        {
          permission_id: 9,
          permission_name: 'Amend Payment Terms',
        },
        {
          permission_id: 10,
          permission_name: 'Enter Enforcement',
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
          permission_id: 1,
          permission_name: 'Create and manage draft accounts',
        },
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
          permission_id: 6,
          permission_name: 'Search and view accounts',
        },
        {
          permission_id: 8,
          permission_name: 'Add Account Activity Notes',
        },
        {
          permission_id: 7,
          permission_name: 'Account Maintenance',
        },
        {
          permission_id: 9,
          permission_name: 'Amend Payment Terms',
        },
        {
          permission_id: 10,
          permission_name: 'Enter Enforcement',
        },
      ],
    },
  ],
};
