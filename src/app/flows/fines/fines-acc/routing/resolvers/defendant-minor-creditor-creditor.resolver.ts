import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountMinorCreditorCreditor } from '../../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';

export const minorCreditorAccountCreditorResolver: ResolveFn<IOpalFinesAccountMinorCreditorCreditor> = (
  route: ActivatedRouteSnapshot,
) => {
  const accountId = route.paramMap.get('accountId');

  if (!accountId) {
    throw new Error('Account ID is required');
  }

  const opalFinesService = inject(OpalFines);

  return opalFinesService.getMinorCreditorAccount(Number(accountId));
};
