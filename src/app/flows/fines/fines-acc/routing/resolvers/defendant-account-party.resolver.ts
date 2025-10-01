import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, catchError, of } from 'rxjs';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { IFinesAccDebtorAddAmendForm } from '../../fines-acc-debtor-add-amend/interfaces/fines-acc-debtor-add-amend-form.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../constants/fines-acc-defendant-routing-paths.constant';
export const defendantAccountPartyResolver: ResolveFn<IFinesAccDebtorAddAmendForm | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = route.paramMap.get('accountId');
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);
  const payloadService = inject(FinesAccPayloadService);

  if (!accountId) {
    // Navigate back to defendant details page if account ID is missing
    return new RedirectCommand(router.createUrlTree([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]));
  }

  const accountState = accountStore.getAccountState();
  const { account_id, business_unit_user_id, business_unit_id, party_id } = accountState;

  if (!account_id || !business_unit_user_id || !business_unit_id || !party_id) {
    // Navigate back to defendant details page if account state is not properly initialized
    return new RedirectCommand(router.createUrlTree([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]));
  }

  /**
   * Fetches the defendant account Party data from cache, transforms it to debtor form structure.
   * This data should already be cached from the "Defendant" tab visit.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the transformed debtor form data or redirects to Account Enquiry on error.
   */
  return opalFinesService.getDefendantAccountParty(account_id, business_unit_id, business_unit_user_id, party_id).pipe(
    map((defendantData) => ({
      formData: payloadService.mapDebtorAccountPartyPayload(defendantData),
      nestedFlow: false,
    })),
    catchError(() => {
      // If API call fails, redirect back to defendant details page
      return of(new RedirectCommand(router.createUrlTree([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details])));
    }),
  );
};
