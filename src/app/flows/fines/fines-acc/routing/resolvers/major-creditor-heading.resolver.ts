import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, of, tap } from 'rxjs';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { map } from 'rxjs/operators';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { IOpalFinesAccountMajorCreditorDetailsHeader } from '../../fines-acc-major-creditor-details/interfaces/fines-acc-major-creditor-details-header.interface';
import { majorCreditorDetailsRedirect } from './helpers/fines-acc-resolver-redirect';

/**
 * Resolves major creditor account header data, stores the account summary state, and redirects when the account cannot be resolved.
 */
export const majorCreditorAccountHeadingResolver: ResolveFn<
  IOpalFinesAccountMajorCreditorDetailsHeader | RedirectCommand
> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const router = inject(Router);

  if (!accountId) {
    return majorCreditorDetailsRedirect(router);
  }

  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);

  return opalFinesService.getMajorCreditorAccountHeadingData(Number(accountId)).pipe(
    tap((headingData) => {
      accountStore.setAccountState(
        payloadService.transformMajorCreditorAccountHeaderForStore(Number(accountId), headingData),
      );
    }),
    map((headingData) => payloadService.transformPayload(headingData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)),
    catchError(() => {
      return of(majorCreditorDetailsRedirect(router));
    }),
  );
};
