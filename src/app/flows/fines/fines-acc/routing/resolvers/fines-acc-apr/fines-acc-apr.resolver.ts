import { inject } from '@angular/core';
import { createUrlTreeFromSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../../services/fines-acc-payload.service';
import { FINES_ACC_APR_ROUTING_PATHS } from '../../../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';
import { canAddApr, canChangeApr, canRemoveApr } from '../../../fines-acc-apr-manage/utils/fines-acc-apr.utils';

export const finesAccAprResolver: ResolveFn<IOpalFinesAprsResponse> = (route) => {
  const api = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);
  const router = inject(Router);
  const accountId = Number(route.paramMap.get('accountId'));

  return forkJoin({
    heading: api.getDefendantAccountHeadingData(accountId),
    data: api.getAprs(accountId),
  }).pipe(
    map(({ heading, data }) => {
      if (!data.version?.trim()) {
        return new RedirectCommand(router.parseUrl('/error/internal-server'));
      }
      accountStore.setAccountState({
        ...payloadService.transformDefendantAccountHeaderForStore(accountId, heading),
        base_version: data.version,
      });
      const { children } = FINES_ACC_APR_ROUTING_PATHS;
      const path = route.routeConfig?.path;
      const mode = route.paramMap.get('mode');
      const selectedId = Number(route.queryParamMap.get('alternatePaymentReferenceId'));
      const selected = data.references.find((reference) => reference.alternate_payment_reference_id === selectedId);
      const invalidSelection =
        (mode === children.change && (!selected || !canChangeApr(selected))) ||
        (path === `${FINES_ACC_APR_ROUTING_PATHS.root}/${children.delete}` && (!selected || !canRemoveApr(selected)));
      if (invalidSelection || (mode === children.add && !canAddApr(data.references))) {
        return new RedirectCommand(createUrlTreeFromSnapshot(route, ['../', children.manage]));
      }
      return data;
    }),
  );
};
