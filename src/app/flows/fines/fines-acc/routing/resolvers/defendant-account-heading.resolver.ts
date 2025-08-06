import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, switchMap } from 'rxjs';
import { IDefendantAccountHeadingResolverResponse } from '../interfaces/fines-acc-defendant-account-heading-resolver-response.interface';

export function defendantAccountHeadingResolver(): ResolveFn<IDefendantAccountHeadingResolverResponse> {
  return (route: ActivatedRouteSnapshot) => {
    const accountId = Number(route.paramMap.get('accountId'));

    const opalFinesService = inject(OpalFines);

    return opalFinesService.getDefendantAccountHeadingData(accountId).pipe(
      switchMap((headingData) =>
        opalFinesService.getBusinessUnitById(headingData.businessUnitId).pipe(
          map((businessUnit) => ({
            headingData,
            businessUnit,
          })),
        ),
      ),
    );
  };
}
