import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FINES_FPU_TAB_FRAGMENTS } from '../../constants/fines-fpu-tab-fragments.constant';
import { FinesFpuPayloadService } from '../../services/fines-fpu-payload.service';
import { FINES_FPU_RESOLVER_EMPTY_RESPONSE } from './constants/fines-fpu-resolver-empty-response.constant';

/**
 * Resolves submitted fixed penalty draft accounts before the To publish page is displayed.
 *
 * @param route - The requested route, including its initial tab fragment.
 * @returns Draft accounts for permitted business units, or an empty response for placeholder tabs or no permissions.
 */
export const finesFpuTabResolver: ResolveFn<IOpalFinesDraftAccountsResponse> = (route) => {
  if (route.fragment === FINES_FPU_TAB_FRAGMENTS.published || route.fragment === FINES_FPU_TAB_FRAGMENTS.uploadErrors) {
    return of(FINES_FPU_RESOLVER_EMPTY_RESPONSE);
  }

  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);
  const payloadService = inject(FinesFpuPayloadService);
  const params = payloadService.buildDraftAccountParams(globalStore.userState());

  if (!params.businessUnitIds?.length) {
    return of(FINES_FPU_RESOLVER_EMPTY_RESPONSE);
  }

  return opalFinesService.getDraftAccounts(params);
};
