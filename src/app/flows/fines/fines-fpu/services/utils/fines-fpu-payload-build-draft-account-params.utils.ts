import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { getFinesFpuPublishBusinessUnitIds } from './fines-fpu-publish-business-unit-ids.utils';

/**
 * Builds the fixed penalty draft account query across all uploaders and upload dates.
 *
 * @param userState - The signed-in user's business unit permissions.
 * @returns Submitted VPFPO draft account filters scoped to eligible business units.
 */
export function buildFinesFpuDraftAccountParams(userState: IOpalUserState): IOpalFinesDraftAccountParams {
  return {
    source: 'VPFPO',
    businessUnitIds: getFinesFpuPublishBusinessUnitIds(userState),
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted],
  };
}
