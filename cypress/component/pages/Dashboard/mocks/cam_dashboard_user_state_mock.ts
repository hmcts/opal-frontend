import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

export const CAM_DASHBOARD_USER_STATE_MOCK: IOpalUserState = {
  user_id: 50000000,
  username: 'testUserCAM@dev.platform.hmcts.net',
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
          permission_code: 'CREATE_MANAGE_DRAFT_ACCOUNTS',
          permission_name: 'Create and Manage Draft Accounts',
        },
      ],
    },
  ],
};
