import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, switchMap } from 'rxjs';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';

export const defendantAccountPaymentTermsLatestResolver: ResolveFn<
  | { paymentTermsData: IOpalFinesAccountDefendantDetailsPaymentTermsLatest; resultData: IOpalFinesResultRefData }
  | RedirectCommand
> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const opalFinesService = inject(OpalFines);

  /**
   * Fetches the defendant account payment terms latest data using a chaining approach:
   * 1. First calls getDefendantAccountPaymentTermsLatest to obtain the latest enforcement action and result_id
   *    (this data will already be cached from the tab load)
   * 2. Then calls getResult using the result_id to get the enforcement action details
   * 3. Returns the raw payload data for transformation by the parent component
   *
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the raw payment terms and result data or redirects to defendant details on error.
   */
  return opalFinesService.getDefendantAccountPaymentTermsLatest(Number(accountId)).pipe(
    switchMap((paymentTermsData) => {
      const resultId = paymentTermsData.last_enforcement;

      return opalFinesService.getResult(resultId!).pipe(
        map((resultData) => ({
          paymentTermsData,
          resultData,
        })),
      );
    }),
  );
};
