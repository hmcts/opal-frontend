import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

export const finesDraftCheckAndManageTabResolver: ResolveFn<IOpalFinesDraftAccountsResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);
  const fragment = route.fragment;
  const statuses = fragment ? FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === fragment)?.statuses : null;

  if (!statuses) {
    return of({ count: 0, summaries: [] });
  }

  const userState = globalStore.userState();
  const businessUnitIds = userState.business_unit_user.map((u) => u.business_unit_id);
  const businessUnitUserIds = userState.business_unit_user.map((u) => u.business_unit_user_id);

  const params = { businessUnitIds, statuses, submittedBy: businessUnitUserIds };
  return opalFinesService.getDraftAccounts(params);
};
