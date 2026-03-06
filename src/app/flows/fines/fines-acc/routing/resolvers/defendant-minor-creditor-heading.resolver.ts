import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { tap } from 'rxjs';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { map } from 'rxjs/operators';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../../fines-acc-minor-creditor-details/interfaces/fines-acc-minor-creditor-details-header.interface';

export const minorCreditorAccountHeadingResolver: ResolveFn<IOpalFinesAccountMinorCreditorDetailsHeader> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = Number(route.paramMap.get('accountId'));

  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);

  /**
   * Fetches the minor creditor account heading data, transforms it and passes it to the account store.
   * @param accountId - The ID of the minor creditor account.
   * @returns An observable that emits the minor creditor account heading data.
   * If the account ID is not provided, it returns an empty observable.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService.getMinorCreditorAccountHeadingData(accountId).pipe(
    tap((headingData) => {
      accountStore.setAccountState(
        payloadService.transformAccountHeaderForStore(accountId, headingData, 'minorCreditor'),
      );
    }),
    map((headingData) => payloadService.transformPayload(headingData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)),
  );
};
