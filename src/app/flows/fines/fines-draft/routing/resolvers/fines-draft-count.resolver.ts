import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { map } from 'rxjs';
import { IFinesDraftCountResolverOptions } from './interfaces/fines-draft-count-resolver-options.interface';
import { buildFinesDraftAccountParams } from '../../utils/fines-draft-account-params.utils';

/**
 * Creates a route resolver that returns the draft account count for configured statuses.
 *
 * @param options - Statuses and optional submitter filters for the count request.
 * @returns A resolver that fetches matching draft accounts and emits only the response count.
 */
export function finesDraftCountResolver(options: IFinesDraftCountResolverOptions): ResolveFn<number> {
  return () => {
    const opalFinesService = inject(OpalFines);
    const globalStore = inject(GlobalStore);
    const params: IOpalFinesDraftAccountParams = buildFinesDraftAccountParams(globalStore.userState(), options);

    return opalFinesService.getDraftAccounts(params).pipe(map((res) => res.count));
  };
}
