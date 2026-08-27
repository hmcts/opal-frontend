import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_TAB_FRAGMENT } from '../../../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from '../../../routing/resolvers/constants/fines-draft-resolver-empty-response.constant';
import { buildFinesDraftAccountParams } from '../../../utils/fines-draft-account-params.utils';

/**
 * Resolves all rejected draft accounts submitted by other team members.
 *
 * @returns A resolver that fetches rejected draft accounts excluding the current user's submissions.
 */
export const finesDraftCreateAndManageViewAllRejectedResolver: ResolveFn<IOpalFinesDraftAccountsResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);

  const statuses =
    FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === FINES_DRAFT_TAB_FRAGMENT.rejected)?.statuses ?? null;
  if (!statuses) {
    return of(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
  }

  const params = buildFinesDraftAccountParams(globalStore.userState(), {
    statuses,
    includeSubmittedBy: false,
    includeNotSubmittedBy: true,
  });

  return opalFinesService.getDraftAccounts(params);
};
