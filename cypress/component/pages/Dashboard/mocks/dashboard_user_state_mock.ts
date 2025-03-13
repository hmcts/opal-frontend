import { ISessionUserState } from 'src/app/services/session-service/interfaces/session-user-state.interface';

export const DASHBOARD_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.timTest',
  user_name: 'timmyTest@HMCTS.NET',
  name: 'Timmy Test',
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
          permission_id: 35,
          permission_name: 'CAV',
        },
        {
          permission_id: 501,
          permission_name: 'CAM',
        },
      ],
    },
  ],
};
