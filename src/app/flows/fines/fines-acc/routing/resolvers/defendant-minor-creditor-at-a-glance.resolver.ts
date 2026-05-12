import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '../../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';

export const minorCreditorAccountAtAGlanceResolver: ResolveFn<IOpalFinesAccountMinorCreditorAtAGlance> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = route.paramMap.get('accountId');

  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const opalFinesService = inject(OpalFines);

  /**
   * Fetches the minor creditor account at-a-glance data from cache.
   * This data should already be cached from the "At A Glance" tab visit.
   * @param accountId - The ID of the minor creditor account.
   * @returns An observable that emits the at-a-glance data.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService.getMinorCreditorAccountAtAGlance(Number(accountId));
};
