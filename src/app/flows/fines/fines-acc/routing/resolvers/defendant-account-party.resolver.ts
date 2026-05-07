import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, catchError, of, switchMap } from 'rxjs';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../../../fines/fines-acc/services/constants/fines-acc-map-transform-items-config.constant';
import { createDefendantDetailsRedirect } from './helpers/fines-acc-resolver-redirect';
import { FINES_ACC_DEBTOR_TYPES } from '../../constants/fines-acc-debtor-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-modes.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';

export const defendantAccountPartyResolver: ResolveFn<
  IOpalFinesAccountDefendantAccountParty | RedirectCommand | null
> = (route: ActivatedRouteSnapshot) => {
  const partyType: string = route.paramMap.get('partyType')!;
  const mode: string = route.paramMap.get('mode')!;
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
      const isAddParentGuardianMode =
        mode === FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.ADD &&
        partyType === FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN;

      if (isAddParentGuardianMode) {
        const canAddParentGuardian =
          headingData.is_youth &&
          headingData.debtor_type === FINES_ACC_DEBTOR_TYPES.defendant &&
          !headingData.parent_guardian_party_id;

        return canAddParentGuardian ? of(null) : of(createDefendantDetailsRedirect(router));
      }

      const partyId =
        partyType === 'parentGuardian' ? headingData.parent_guardian_party_id : headingData.defendant_account_party_id;

      if (!partyId) {
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
