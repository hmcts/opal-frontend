import { IUserState } from '@hmcts/opal-frontend-common/services/user-service/interfaces';

export const ACCOUNT_SESSION_USER_STATE_MOCK: IUserState = {
  user_id: 50000000,
  username: 'timmyTest@HMCTS.NET',
  name: 'Timmy Tester',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: 'L017KG',
      business_unit_id: 61,
      permissions: [
        {
          permission_id: 3,
          permission_name: 'Account Enquiry',
        },
        {
          permission_id: 500,
          permission_name: 'Collection Order',
        },
        {
          permission_id: 2,
          permission_name: 'Account Enquiry - Account Notes',
        },
      ],
    },
  ],
};
