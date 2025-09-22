import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';

export const finesDraftCreateAndManageRejectedCountResolver: ResolveFn<number> = () => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);

  const userState = globalStore.userState();
  const businessUnitIds = userState.business_unit_users.map((u) => u.business_unit_id);
  const businessUnitUserIds = userState.business_unit_users.map((u) => u.business_unit_user_id);

  const params = {
    businessUnitIds,
    submittedBy: businessUnitUserIds,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
  };

  return opalFinesService.getDraftAccounts(params).pipe(map((res) => res.count));
};
