import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, of } from 'rxjs';
import { IOpalFinesAccountMinorCreditorCreditor } from '../../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { amendMinorCreditorDetailsRedirect } from './helpers/fines-acc-resolver-redirect';

export const minorCreditorAccountCreditorResolver: ResolveFn<
  IOpalFinesAccountMinorCreditorCreditor | RedirectCommand
> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const router = inject(Router);

  if (!accountId) {
    return amendMinorCreditorDetailsRedirect(router);
  }

  const opalFinesService = inject(OpalFines);

  return opalFinesService.getMinorCreditorAccount(Number(accountId)).pipe(
    catchError(() => {
      return of(amendMinorCreditorDetailsRedirect(router));
    }),
  );
};
