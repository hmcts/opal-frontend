import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

export const defendantAccountEnforcementStatusResolver: ResolveFn<
  IOpalFinesAccountDefendantDetailsEnforcementTabRefData | RedirectCommand
> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const opalFinesService = inject(OpalFines);

  /**
   * Fetches the enforcement status for a specific defendant account.
   *
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the enforcement status data for the specified defendant account.
   */
  return opalFinesService.getDefendantAccountEnforcementStatus(Number(accountId));
};
