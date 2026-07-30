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
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IDateRange } from '@hmcts/opal-frontend-common/services/date-service/interfaces';
import { buildFinesDraftAccountParams } from '../../utils/fines-draft-account-params.utils';

/**
 * Resolves draft accounts for the active or default draft tab.
 *
 * @param options - Controls which statuses and user filters are applied to the resolver request.
 * @returns A resolver that fetches the active tab response or an empty response when no statuses can be resolved.
 */
export function finesDraftTabResolver(options: FinesDraftResolverOptions): ResolveFn<IOpalFinesDraftAccountsResponse> {
  return (route: ActivatedRouteSnapshot) => {
    const fragment = route.fragment ?? options.defaultTab;
    const tab = FINES_DRAFT_TAB_STATUSES.find((_tab) => _tab.tab === fragment);
    const statuses =
      options.useFragmentForStatuses && fragment ? (tab?.statuses ?? null) : (options.defaultStatuses ?? null);

    if (!statuses) {
      return of(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
    }

    const opalFinesService = inject(OpalFines);
    const globalStore = inject(GlobalStore);
    const dateService = inject(DateService);

    const params: IOpalFinesDraftAccountParams = buildFinesDraftAccountParams(globalStore.userState(), {
      ...options,
      statuses,
    });

    // If the tab has a historic window, set and add the date range to params
    if (tab?.historicWindowInDays) {
      const { from, to }: IDateRange = dateService.getDateRange(tab.historicWindowInDays, 0);
      params.accountStatusDateFrom = [from];
      params.accountStatusDateTo = [to];
    }

    return opalFinesService.getDraftAccounts(params);
  };
}
