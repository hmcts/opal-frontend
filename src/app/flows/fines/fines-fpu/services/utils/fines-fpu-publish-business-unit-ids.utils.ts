import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

/**
 * Gets the business units for which the user can publish fixed penalties.
 *
 * @param userState - The signed-in user's business unit permissions.
 * @returns Distinct business unit IDs with the publish fixed penalty permission.
 */
export function getFinesFpuPublishBusinessUnitIds(userState: IOpalUserState): number[] {
  return [
    ...new Set(
      userState.business_unit_users
        .filter((businessUnitUser) =>
          businessUnitUser.permissions.some(
            (permission) => permission.permission_id === FINES_PERMISSIONS['publish-fixed-penalty'],
          ),
        )
        .map((businessUnitUser) => businessUnitUser.business_unit_id),
    ),
  ];
}
