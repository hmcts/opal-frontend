import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';

export const CAV_DASHBOARD_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.testUser',
  user_name: 'testUserCAV@HMCTS.NET',
  name: 'Test User',
  business_unit_user: [
    {
      business_unit_user_id: 'L017KG',
      business_unit_id: 17,
      permissions: [
        {
          permission_id: 54,
          permission_name: 'Account Enquiry',
        },
        {
          permission_id: 41,
          permission_name: 'Account Enquiry - Account Notes',
        },
        {
          permission_id: 501,
          permission_name: 'CAM',
        },
      ],
    },
  ],
};
