import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, of, switchMap } from 'rxjs';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { IFinesAccPaymentTermsAmendForm } from '../../fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-form.interface';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-transform-items-config.constant';
import { createDefendantDetailsRedirect } from './helpers/fines-acc-resolver-redirect';

export const defendantAccountPaymentTermsLatestResolver: ResolveFn<IFinesAccPaymentTermsAmendForm | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
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
   * 3. Maps the combined response payload to the form structure for payment terms amendment
   *
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the transformed payment terms data or redirects to defendant details on error.
   */
  return opalFinesService.getDefendantAccountPaymentTermsLatest(Number(accountId)).pipe(
    switchMap((paymentTermsData) => {
      // Extract the result_id for the enforcement action
      const resultId = paymentTermsData.last_enforcement;

      if (!resultId) {
        return of(createDefendantDetailsRedirect(router));
      }

      return opalFinesService
        .getResult(resultId)
        .pipe(
          map((resultData) =>
            payloadService.transformPaymentTermsPayload(
              payloadService.transformPayload(paymentTermsData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG),
              resultData,
            ),
          ),
        );
    }),
  );
};
