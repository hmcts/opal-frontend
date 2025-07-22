import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';

export const DRAFT_SESSION_USER_STATE_MOCK: ISessionUserState = {
  user_id: 'gl.timTest',
  user_name: 'timmyTest@HMCTS.NET',
  name: 'Timmy Test',
  business_unit_user: [
    {
      business_unit_user_id: 'L073JG',
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
