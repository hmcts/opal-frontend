import { type IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { IFinesDraftAccountParamOptions } from '../interfaces/fines-draft-account-param-options.interface';

/**
 * Builds draft account request params from the current user state and supplied filters.
 *
 * @param userState - The signed-in user's business unit access state.
 * @param options - Status and optional submitter filters for the draft account request.
 * @returns Draft account request params scoped to the user's business units and optional user filter.
 */
export function buildFinesDraftAccountParams(
  userState: IOpalUserState,
  options: IFinesDraftAccountParamOptions,
): IOpalFinesDraftAccountParams {
  const businessUnitUsers = userState.business_unit_users;
  const businessUnitUserIds = businessUnitUsers.map((u) => u.business_unit_user_id);

  const params: IOpalFinesDraftAccountParams = {
    businessUnitIds: businessUnitUsers.map((u) => u.business_unit_id),
    statuses: options.statuses,
  };

  if (options.includeSubmittedBy) {
    params.submittedBy = businessUnitUserIds;
  }

  if (options.includeNotSubmittedBy) {
    params.notSubmittedBy = businessUnitUserIds;
  }

  return params;
}
