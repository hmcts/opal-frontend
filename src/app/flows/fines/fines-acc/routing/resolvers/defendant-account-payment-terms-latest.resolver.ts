import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-transform-items-config.constant';
import { createDefendantDetailsRedirect } from './helpers/fines-acc-resolver-redirect';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

export const defendantAccountPaymentTermsLatestResolver: ResolveFn<
  RedirectCommand | IOpalFinesAccountDefendantDetailsPaymentTermsLatest
> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);
  const payloadService = inject(FinesAccPayloadService);

  if (!accountId) {
    return createDefendantDetailsRedirect(router);
  }

  /**
   * Fetches the defendant account payment terms latest data using a chaining approach:
   * 1. First calls getDefendantAccountPaymentTermsLatest to obtain the latest enforcement action and result_id
   *    (this data will already be cached from the tab load)
   * 2. Then calls getResult using the result_id to get the enforcement action details
   *
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the transformed payment terms data.
   */
  return opalFinesService.getDefendantAccountPaymentTermsLatest(Number(accountId)).pipe(
    switchMap((paymentTermsData) => {
      // Extract the result_id for the enforcement action
      const resultId = paymentTermsData.last_enforcement;

      // If there is no resultId, return the payment terms data without result details.
      if (!resultId) {
        return of(payloadService.transformPayload(paymentTermsData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)).pipe(
          catchError(() => {
            return of(createDefendantDetailsRedirect(router));
          }),
        );
      }

      // Fetch the result details using the resultId and add it to the payment terms data.
      return opalFinesService.getResult(resultId).pipe(
        map((resultData) =>
          payloadService.transformPayload(
            { ...paymentTermsData, resultData: resultData },
            FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
          ),
        ),
        catchError(() => {
          return of(createDefendantDetailsRedirect(router));
        }),
      );
    }),
  );
};
