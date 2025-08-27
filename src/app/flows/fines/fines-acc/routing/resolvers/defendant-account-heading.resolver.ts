import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { tap } from 'rxjs';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';
import { FinesAccountStore } from '../../stores/fines-acc.store';

export const defendantAccountHeadingResolver: ResolveFn<IOpalFinesDefendantAccountHeader> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = Number(route.paramMap.get('accountId'));

  const opalFinesService = inject(OpalFines);
  const accountStore = inject(FinesAccountStore);

  /**
   * Fetches the defendant account heading data and passes it to the account store.
   * @param accountId - The ID of the defendant account.
   * @returns An observable that emits the defendant account heading data.
   * If the account ID is not provided, it returns an empty observable.
   * @throws Error if the account ID is invalid or if the data cannot be fetched.
   */
  return opalFinesService.getDefendantAccountHeadingData(accountId).pipe(
    tap((headingData) => {
      accountStore.setAccountState(headingData);
    }),
  );
};
