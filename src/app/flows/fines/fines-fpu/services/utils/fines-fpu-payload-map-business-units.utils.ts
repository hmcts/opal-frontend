import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { IFinesFpuBusinessUnit } from '../../interfaces/fines-fpu-business-unit.interface';
import { getFinesFpuPublishBusinessUnitIds } from './fines-fpu-publish-business-unit-ids.utils';

/**
 * Groups submitted draft accounts into eligible business unit ticket totals.
 *
 * @param response - Draft accounts returned by the VPFPO query.
 * @param userState - The signed-in user's business unit permissions.
 * @returns Alphabetically sorted business unit summaries without individual account details.
 */
export function mapFinesFpuDraftAccountsToBusinessUnits(
  response: IOpalFinesDraftAccountsResponse,
  userState: IOpalUserState,
): IFinesFpuBusinessUnit[] {
  const permittedBusinessUnitIds = new Set(getFinesFpuPublishBusinessUnitIds(userState));
  const draftAccountIds = new Set<number>();
  const businessUnits = new Map<number, IFinesFpuBusinessUnit>();

  for (const summary of response.summaries) {
    if (
      !permittedBusinessUnitIds.has(summary.business_unit_id) ||
      summary.account_status !== OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted ||
      draftAccountIds.has(summary.draft_account_id)
    ) {
      continue;
    }

    draftAccountIds.add(summary.draft_account_id);
    const businessUnit = businessUnits.get(summary.business_unit_id);

    if (businessUnit) {
      businessUnit.ticket_count += 1;
    } else {
      businessUnits.set(summary.business_unit_id, {
        business_unit_id: summary.business_unit_id,
        business_unit_name: summary.account_snapshot.business_unit_name,
        ticket_count: 1,
      });
    }
  }

  return [...businessUnits.values()].sort((first, second) =>
    first.business_unit_name.localeCompare(second.business_unit_name, 'en-GB', { sensitivity: 'base' }),
  );
}
