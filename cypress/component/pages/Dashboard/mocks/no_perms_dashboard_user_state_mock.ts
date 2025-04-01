import { ISessionUserState } from 'src/app/services/session-service/interfaces/session-user-state.interface';

export const NO_PERMS_DASHBOARD_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.testUser',
  user_name: 'noPermissionsTestUser@HMCTS.NET',
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
      ],
    },
  ],
};
