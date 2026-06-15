import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync } from '@angular/router';
import { map, tap } from 'rxjs';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../../fines-acc-minor-creditor-details/interfaces/fines-acc-minor-creditor-details-header.interface';
import { BusinessUnitIdResolver } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';

type FinesAccountRouteType = 'defendant' | 'minor-creditor';

/**
 * Normalizes a business unit identifier from store or API state into a positive numeric value.
 *
 * @param businessUnitId - The raw business unit identifier to parse.
 * @returns The parsed business unit id, or `null` when the value is missing or invalid.
 */
const getBusinessUnitId = (businessUnitId: string | null | undefined): number | null => {
  const parsedBusinessUnitId = Number(businessUnitId);

  return Number.isFinite(parsedBusinessUnitId) && parsedBusinessUnitId > 0 ? parsedBusinessUnitId : null;
};

@Injectable({
  providedIn: 'root',
})
export class FinesAccountBusinessUnitResolver implements BusinessUnitIdResolver {
  private readonly accountStore = inject(FinesAccountStore);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);

  /**
   * Resolves the business unit for the account in the current route.
   *
   * This first reuses the value already held in `FinesAccountStore` when the
   * stored account matches the requested account. If no matching store state is
   * available, it fetches the account heading data for the current account type,
   * updates the store, and returns the business unit id for the permission guard.
   *
   * @param route - The activated route containing the account id and account type.
   * @returns The resolved business unit id, or `null` when it cannot be determined.
   */
  public resolveBusinessUnitId(route: ActivatedRouteSnapshot): MaybeAsync<number | null> {
    const accountId = Number(route.paramMap.get('accountId'));
    const accountType = route.data?.['accountType'] as FinesAccountRouteType | undefined;

    if (!Number.isFinite(accountId) || accountId <= 0) {
      return null;
    }

    const storedAccountId = this.accountStore.account_id();
    const storedBusinessUnitId = getBusinessUnitId(this.accountStore.business_unit_id());

    if (storedAccountId === accountId && storedBusinessUnitId !== null) {
      return storedBusinessUnitId;
    }

    if (accountType === 'defendant') {
      return this.opalFinesService.getDefendantAccountHeadingData(accountId).pipe(
        tap((headingData: IOpalFinesAccountDefendantDetailsHeader) => {
          this.accountStore.setAccountState(
            this.payloadService.transformDefendantAccountHeaderForStore(accountId, headingData),
          );
        }),
        map((headingData: IOpalFinesAccountDefendantDetailsHeader) =>
          getBusinessUnitId(headingData.business_unit_summary.business_unit_id),
        ),
      );
    }

    if (accountType === 'minor-creditor') {
      return this.opalFinesService.getMinorCreditorAccountHeadingData(accountId).pipe(
        tap((headingData: IOpalFinesAccountMinorCreditorDetailsHeader) => {
          this.accountStore.setAccountState(
            this.payloadService.transformMinorCreditorAccountHeaderForStore(accountId, headingData),
          );
        }),
        map((headingData: IOpalFinesAccountMinorCreditorDetailsHeader) =>
          getBusinessUnitId(headingData.business_unit.business_unit_id),
        ),
      );
    }

    return null;
  }
}
