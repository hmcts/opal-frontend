import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { of, switchMap } from 'rxjs';
import { FINES_ACC_ENF_ACTION_SELECT_ALL_PERMITTED_ACTIONS } from '../../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-next-permitted-actions.constant';
import { getNextPermittedActionIds } from '../../fines-acc-enf-action-select/utils/fines-acc-enf-action-next-permitted-actions.utils';

const EMPTY_NEXT_PERMITTED_ENF_ACTIONS: IOpalFinesResultsRefData = {
  count: 0,
  refData: [],
};

/**
 * Resolves the next permitted enforcement actions by mapping the enforcement status payload to result ids.
 * Fetches all enforcement results when the status payload allows all permitted actions.
 */
export const nextPermittedEnfActionsResolver: ResolveFn<IOpalFinesResultsRefData> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const opalFinesService = inject(OpalFines);

  return opalFinesService.getDefendantAccountEnforcementStatus(Number(accountId)).pipe(
    switchMap((enforcementStatus) => {
      const nextPermittedActionIds = getNextPermittedActionIds(
        enforcementStatus.next_enforcement_action_data,
        FINES_ACC_ENF_ACTION_SELECT_ALL_PERMITTED_ACTIONS,
      );

      if (nextPermittedActionIds === null) {
        return opalFinesService.getResults([], { enforcement: true, enforcement_override: false });
      }

      if (nextPermittedActionIds.length === 0 && !enforcementStatus.last_enforcement_action) {
        return opalFinesService.getResults([], { enforcement: true, enforcement_override: false });
      }

      if (nextPermittedActionIds.length === 0) {
        return of(EMPTY_NEXT_PERMITTED_ENF_ACTIONS);
      }

      return opalFinesService.getResults(nextPermittedActionIds);
    }),
  );
};
