import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { IOpalFinesDraftAccountsSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-accounts-summary.interface';

export const FINES_FPU_PAYLOAD_USER_STATE_MOCK: IOpalUserState = {
  user_id: 1,
  username: '',
  name: '',
  status: 'active',
  version: 1,
  business_unit_users: [
    {
      business_unit_user_id: '78',
      business_unit_id: 78,
      permissions: [
        { permission_id: FINES_PERMISSIONS['publish-fixed-penalty'], permission_name: 'Publish Fixed Penalties' },
      ],
    },
    {
      business_unit_user_id: '12',
      business_unit_id: 12,
      permissions: [
        { permission_id: FINES_PERMISSIONS['publish-fixed-penalty'], permission_name: 'Publish Fixed Penalties' },
      ],
    },
    {
      business_unit_user_id: '34',
      business_unit_id: 34,
      permissions: [
        {
          permission_id: FINES_PERMISSIONS['create-and-manage-draft-accounts'],
          permission_name: 'Create and manage draft accounts',
        },
      ],
    },
    {
      business_unit_user_id: '90',
      business_unit_id: 90,
      permissions: [
        { permission_id: FINES_PERMISSIONS['publish-fixed-penalty'], permission_name: 'Publish Fixed Penalties' },
      ],
    },
  ],
};

export const FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK: IOpalFinesDraftAccountsSummary = {
  draft_account_id: 101,
  created_at: '2026-01-01T10:00:00Z',
  submitted_by: '78',
  business_unit_id: 78,
  account_snapshot: {
    account_type: 'Fixed Penalty',
    created_date: '2026-01-01',
    submitted_by: '78',
    defendant_name: '',
    submitted_by_name: '',
    business_unit_name: 'Zedford',
    date_of_birth: null,
  },
  account_type: 'Fixed Penalty',
  account_status: OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted,
  account_number: '',
  account_status_date: '2026-01-01T10:00:00Z',
};
