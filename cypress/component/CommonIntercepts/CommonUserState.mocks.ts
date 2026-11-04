import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

export const ENTER_ENFORCEMENT_PERMISSION = {
  permission_code: 'ENTER_ENFORCEMENT',
  permission_name: 'Enter Enforcement',
};
export const MAINTENANCE_PERMISSION = {
  permission_code: 'ACCOUNT_MAINTENANCE',
  permission_name: 'Account Maintenance',
};

export const USER_STATE_MOCK_NO_PERMISSION: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserNote@dev.platform.hmcts.net',
  name: 'Test User',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L077AO',
      business_unit_id: 77,
      permissions: [
        {
          permission_code: 'ACCOUNT_ENQUIRY',
          permission_name: 'Account Enquiry',
        },
        {
          permission_code: 'ACCOUNT_ENQUIRY_NOTES',
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_code: 'CHECK_VALIDATE_DRAFT_ACCOUNTS',
          permission_name: 'Check and Validate Draft Accounts',
        },
        {
          permission_code: 'SEARCH_AND_VIEW_ACCOUNTS',
          permission_name: 'Search and view accounts',
        },
      ],
    },
  ],
};

export const USER_STATE_MOCK_PERMISSION_BU17: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserNote@dev.platform.hmcts.net',
  name: 'Test User',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L017KG',
      business_unit_id: 17,
      permissions: [
        {
          permission_code: 'ACCOUNT_ENQUIRY',
          permission_name: 'Account Enquiry',
        },
        {
          permission_code: 'ACCOUNT_ENQUIRY_NOTES',
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_code: 'CHECK_VALIDATE_DRAFT_ACCOUNTS',
          permission_name: 'Check and Validate Draft Accounts',
        },
        {
          permission_code: 'SEARCH_AND_VIEW_ACCOUNTS',
          permission_name: 'Search and view accounts',
        },
        {
          permission_code: 'ADD_ACCOUNT_ACTIVITY_NOTES',
          permission_name: 'Add Account Activity Notes',
        },
        {
          permission_code: 'ACCOUNT_MAINTENANCE',
          permission_name: 'Account Maintenance',
        },
        {
          permission_code: 'AMEND_PAYMENT_TERMS',
          permission_name: 'Amend Payment Terms',
        },
        {
          permission_code: 'ENTER_ENFORCEMENT',
          permission_name: 'Enter Enforcement',
        },
      ],
    },
  ],
};
export const USER_STATE_MOCK_PERMISSION_BU77: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserNote@dev.platform.hmcts.net',
  name: 'Test User',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L077AO',
      business_unit_id: 77,
      permissions: [
        {
          permission_code: 'CREATE_MANAGE_DRAFT_ACCOUNTS',
          permission_name: 'Create and manage draft accounts',
        },
        {
          permission_code: 'ACCOUNT_ENQUIRY',
          permission_name: 'Account Enquiry',
        },
        {
          permission_code: 'ACCOUNT_ENQUIRY_NOTES',
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_code: 'CHECK_VALIDATE_DRAFT_ACCOUNTS',
          permission_name: 'Check and Validate Draft Accounts',
        },

        {
          permission_code: 'SEARCH_AND_VIEW_ACCOUNTS',
          permission_name: 'Search and view accounts',
        },
        {
          permission_code: 'ADD_ACCOUNT_ACTIVITY_NOTES',
          permission_name: 'Add Account Activity Notes',
        },
        {
          permission_code: 'ACCOUNT_MAINTENANCE',
          permission_name: 'Account Maintenance',
        },
        {
          permission_code: 'AMEND_PAYMENT_TERMS',
          permission_name: 'Amend Payment Terms',
        },
        {
          permission_code: 'ENTER_ENFORCEMENT',
          permission_name: 'Enter Enforcement',
        },
        {
          permission_code: 'CONSOLIDATE',
          permission_name: 'Consolidate',
        },
      ],
    },
  ],
};
