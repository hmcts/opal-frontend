import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { map } from 'rxjs/operators';

export const defendantAccountHeadingResolver: ResolveFn<IOpalFinesAccountDefendantDetailsHeader> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = Number(route.paramMap.get('accountId'));

  const opalFinesService = inject(OpalFines);

  /**
   * Fetches the defendant account heading data, transforms it and passes it to the account store.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the defendant account heading data.
   * If the account ID is not provided, it returns an empty observable.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService.getDefendantAccountHeadingData(accountId).pipe(map((headingData) => headingData));
};
