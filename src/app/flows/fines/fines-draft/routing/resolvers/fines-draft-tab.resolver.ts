import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { FinesDraftResolverOptions } from './interfaces/fines-draft-resolver-options.interface';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from './constants/fines-draft-resolver-empty-response.constant';

export function finesDraftTabResolver(options: FinesDraftResolverOptions): ResolveFn<IOpalFinesDraftAccountsResponse> {
  return (route: ActivatedRouteSnapshot) => {
    const fragment = route.fragment;
    const statuses =
      options.useFragmentForStatuses && fragment
        ? (FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === fragment)?.statuses ?? null)
        : (options.defaultStatuses ?? null);

    if (!statuses) {
      return of(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
    }

    const opalFinesService = inject(OpalFines);
    const globalStore = inject(GlobalStore);
    const userState = globalStore.userState();
    const businessUnitIds = userState.business_unit_user.map((u) => u.business_unit_id);
    const businessUnitUserIds = userState.business_unit_user.map((u) => u.business_unit_user_id);

    const params: IOpalFinesDraftAccountParams = {
      businessUnitIds,
      statuses,
    };

    if (options.includeSubmittedBy) {
      params.submittedBy = businessUnitUserIds;
    }

    if (options.includeNotSubmittedBy) {
      params.notSubmittedBy = businessUnitUserIds;
    }

    return opalFinesService.getDraftAccounts(params);
  };
}
