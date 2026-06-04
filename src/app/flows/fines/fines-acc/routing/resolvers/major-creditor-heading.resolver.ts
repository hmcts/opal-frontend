import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { tap } from 'rxjs';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { map } from 'rxjs/operators';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { IOpalFinesAccountMajorCreditorDetailsHeader } from '../../fines-acc-major-creditor-details/interfaces/fines-acc-major-creditor-details-header.interface';

export const majorCreditorAccountHeadingResolver: ResolveFn<IOpalFinesAccountMajorCreditorDetailsHeader> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = Number(route.paramMap.get('accountId'));

  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);

  return opalFinesService.getMajorCreditorAccountHeadingData(accountId).pipe(
    tap((headingData) => {
      accountStore.setAccountState(payloadService.transformMajorCreditorAccountHeaderForStore(accountId, headingData));
    }),
    map((headingData) => payloadService.transformPayload(headingData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)),
  );
};
