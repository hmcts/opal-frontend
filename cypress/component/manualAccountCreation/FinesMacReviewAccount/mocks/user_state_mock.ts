import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
export const REJECTED_ACCOUNT_SESSION_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.testUserTimmy',
  user_name: 'timmyTest@HMCTS.NET',
  name: 'Timmy Tester',
  business_unit_user: [
    {
      business_unit_user_id: 'L017KG',
      business_unit_id: 61,
      permissions: [
        {
          permission_id: 54,
          permission_name: 'Account Enquiry',
        },
        {
          permission_id: 500,
          permission_name: 'Collection Order',
        },
        {
          permission_id: 41,
          permission_name: 'Account Enquiry - Account Notes',
        },
      ],
    },
  ],
};
