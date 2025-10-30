import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, catchError, of, switchMap } from 'rxjs';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-transform-items-config.constant';

/**
 * Creates a redirect command to the defendant details page
 * @param router - The Angular Router instance
 * @returns A RedirectCommand to the defendant details page
 */
const createDefendantDetailsRedirect = (router: Router): RedirectCommand => {
  return new RedirectCommand(router.createUrlTree([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]));
};

export const defendantAccountPartyResolver: ResolveFn<IOpalFinesAccountDefendantAccountParty | RedirectCommand> = (
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
   * Fetches the defendant account party data using a chaining approach:
   * 1. First calls getDefendantAccountHeadingData to obtain defendant_party_id, parent_guardian_party_id and debtor_type
   *    (this data will already be cached from the account summary page)
   * 2. Then calls getDefendantAccountParty using the appropriate party ID based on debtor_type
   * 3. Maps the response payload to the form structure, consistent with check and validate
   *
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the transformed debtor form data or redirects to defendant details on error.
   */
  return opalFinesService.getDefendantAccountHeadingData(Number(accountId)).pipe(
    switchMap((headingData) => {
      // Determine which party ID to use based on debtor_type
      const partyId =
        headingData.debtor_type === 'Parent/Guardian'
          ? headingData.parent_guardian_party_id
          : headingData.defendant_account_party_id;

      if (!partyId) {
        // If no valid party ID found, redirect back to defendant details
        return of(createDefendantDetailsRedirect(router));
      }

      // Fetch defendant account party data using the determined party ID
      return opalFinesService.getDefendantAccountParty(Number(accountId), partyId).pipe(
        map((data) => payloadService.transformPayload(data, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)),
        catchError(() => {
          return of(createDefendantDetailsRedirect(router));
        }),
      );
    }),
    catchError(() => {
      return of(createDefendantDetailsRedirect(router));
    }),
  );
};
