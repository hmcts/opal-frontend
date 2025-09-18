import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
export const ACCOUNT_SESSION_USER_STATE_MOCK: IOpalUserState = {
  user_id: 50000000,
  username: 'timmyTest@HMCTS.NET',
  name: 'Timmy Test',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L077JG',
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
      ],
    },
  ],
};
