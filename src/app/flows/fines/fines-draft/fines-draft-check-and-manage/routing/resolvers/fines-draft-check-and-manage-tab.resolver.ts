import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';

export const finesDraftCheckAndManageTabResolver: ResolveFn<IOpalFinesDraftAccountsResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const dateService = inject(DateService);
  const globalStore = inject(GlobalStore);

  const fragment = route.fragment;
  const tab = FINES_DRAFT_TAB_STATUSES.find((_tab) => _tab.tab === fragment);

  // If the tab statuses are not found, return an empty response
  if (!tab?.statuses) {
    return of({ count: 0, summaries: [] });
  }

  const userState = globalStore.userState();
  const businessUnitIds = userState.business_unit_user.map((u) => u.business_unit_id);
  const businessUnitUserIds = userState.business_unit_user.map((u) => u.business_unit_user_id);

  const params: IOpalFinesDraftAccountParams = {
    businessUnitIds,
    statuses: tab.statuses,
    submittedBy: businessUnitUserIds,
  };

  // If the tab has a historic window, set and add the date range to params
  if (tab?.historicWindowInDays) {
    const { from, to } = dateService.getDateRange(tab.historicWindowInDays, 0);
    params.accountStatusDateFrom = [from];
    params.accountStatusDateTo = [to];
  }

  return opalFinesService.getDraftAccounts(params);
};
