import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
export const ACCOUNT_SESSION_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.testUserTimmy',
  user_name: 'timmyTest@HMCTS.NET',
  name: 'Timmy Tester',
  business_unit_user: [
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
