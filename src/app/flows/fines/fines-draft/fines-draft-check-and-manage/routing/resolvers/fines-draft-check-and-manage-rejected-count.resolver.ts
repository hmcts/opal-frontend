import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

export const finesDraftCheckAndManageRejectedCountResolver: ResolveFn<number> = () => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);

  const userState = globalStore.userState();
  const businessUnitIds = userState.business_unit_user.map((u) => u.business_unit_id);

  const params = {
    businessUnitIds,
    statuses: [OpalFinesDraftAccountStatuses.rejected],
  };

  return opalFinesService.getDraftAccounts(params).pipe(map((res) => res.count));
};
