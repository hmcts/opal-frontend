import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { map, switchMap } from 'rxjs';

/**
 * Resolves the next permitted enforcement actions by mapping the enforcement status payload to result ids.
 */
export const nextPermittedEnfActionsResolver: ResolveFn<IOpalFinesResultsRefData> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const opalFinesService = inject(OpalFines);

  return opalFinesService.getDefendantAccountEnforcementStatus(Number(accountId)).pipe(
    map(
      (enforcementStatus) =>
        enforcementStatus.next_enforcement_action_data
          ?.split(',')
          .map((actionId) => actionId.trim())
          .filter(Boolean) ?? [],
    ),
    switchMap((nextPermittedActionIds) => opalFinesService.getResults(nextPermittedActionIds)),
  );
};
