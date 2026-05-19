import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { map, switchMap } from 'rxjs';
import { FINES_ACC_ENF_ACTION_SELECT_ALL_PERMITTED_ACTIONS } from '../../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-next-permitted-actions.constant';
import { getNextPermittedActionIds } from '../../fines-acc-enf-action-select/utils/fines-acc-enf-action-next-permitted-actions.utils';

/**
 * Resolves the next permitted enforcement actions by mapping the enforcement status payload to result ids.
 * Fetches all enforcement results when the status payload allows all permitted actions.
 */
export const nextPermittedEnfActionsResolver: ResolveFn<IOpalFinesResultsRefData> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const opalFinesService = inject(OpalFines);

  return opalFinesService.getDefendantAccountEnforcementStatus(Number(accountId)).pipe(
    map((enforcementStatus) =>
      getNextPermittedActionIds(
        enforcementStatus.next_enforcement_action_data,
        FINES_ACC_ENF_ACTION_SELECT_ALL_PERMITTED_ACTIONS,
      ),
    ),
    switchMap((nextPermittedActionIds) =>
      nextPermittedActionIds === null
        ? opalFinesService.getResults([], { enforcement: true, enforcement_override: false })
        : opalFinesService.getResults(nextPermittedActionIds),
    ),
  );
};
