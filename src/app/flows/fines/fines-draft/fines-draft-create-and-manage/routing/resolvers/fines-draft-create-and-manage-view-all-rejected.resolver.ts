import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';

export const finesDraftCreateAndManageViewAllRejectedResolver: ResolveFn<IOpalFinesDraftAccountsResponse> = () => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);

  const userState = globalStore.userState();
  const businessUnitIds = userState.business_unit_users.map((u) => u.business_unit_id);
  const businessUnitUserIds = userState.business_unit_users.map((u) => u.business_unit_user_id);

  const statuses = FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === 'rejected')?.statuses ?? null;
  if (!statuses) {
    return of({ count: 0, summaries: [] });
  }

  const params: IOpalFinesDraftAccountParams = {
    businessUnitIds,
    statuses,
    notSubmittedBy: businessUnitUserIds,
    submittedBy: null,
    accountStatusDateFrom: null,
    accountStatusDateTo: null,
  };
  return opalFinesService.getDraftAccounts(params);
};
