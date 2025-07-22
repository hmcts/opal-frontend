import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';

export const CAM_DASHBOARD_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.testUser',
  user_name: 'testUserCAM@HMCTS.NET',
  name: 'Test User',
  business_unit_user: [
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
          permission_id: 1,
          permission_name: 'Create and Manage Draft Accounts',
        },
      ],
    },
  ],
};
