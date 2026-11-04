import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../../services/fines-acc-payload.service';
import { FINES_ACC_APR_ROUTING_PATHS } from '../../../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';
import { canAccessAprPage } from '../../../fines-acc-apr-manage/utils/fines-acc-apr.utils';

/** Loads account context and APRs, redirecting entries that cannot be managed. */
export const finesAccAprResolver: ResolveFn<IOpalFinesAprsResponse | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);
  const router = inject(Router);
  const accountId = Number(route.paramMap.get('accountId'));
  const action = route.paramMap.get('mode') ?? route.routeConfig?.path?.split('/').at(-1);
  const selectedId = Number(route.queryParamMap.get('alternatePaymentReferenceId'));

  return forkJoin({
    heading: opalFinesService.getDefendantAccountHeadingData(accountId),
    data: opalFinesService.getAprs(accountId),
  }).pipe(
    map(({ heading, data }) => {
      if (!data.version?.trim()) {
        return new RedirectCommand(router.parseUrl('/error/internal-server'));
      }
      accountStore.setAccountState({
        ...payloadService.transformDefendantAccountHeaderForStore(accountId, heading),
        base_version: data.version,
      });
      if (!canAccessAprPage(data.references, action, selectedId)) {
        return new RedirectCommand(
          createUrlTreeFromSnapshot(route, ['../', FINES_ACC_APR_ROUTING_PATHS.children.manage]),
        );
      }
      return data;
    }),
  );
};
