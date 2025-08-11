import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, switchMap } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

export const defendantAccountHeadingResolver: ResolveFn<IOpalFinesDefendantAccountHeader> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = Number(route.paramMap.get('accountId'));

  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);
  const payloadService = inject(FinesMacPayloadService);
  const userState = globalStore.userState();

  /**
   * Fetches the defendant account heading data including business unit information.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the defendant account heading data with business unit information.
   * If the account ID is not provided, it returns an empty observable.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService.getDefendantAccountHeadingData(accountId).pipe(
    switchMap((headingData) => {
      headingData.business_unit_user_id = payloadService.getBusinessUnitBusinessUserId(
        Number(headingData.business_unit_id),
        userState,
      );
      return of(headingData);
    }),
  );
};
