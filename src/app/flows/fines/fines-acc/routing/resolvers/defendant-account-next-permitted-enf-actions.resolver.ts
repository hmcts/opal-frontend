import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { map, switchMap } from 'rxjs';
import { FINES_ACC_ENF_ACTION_SELECT_ALL_PERMITTED_ACTIONS } from '../../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-next-permitted-actions.constant';

const getNextPermittedActionIds = (nextEnforcementActionData: string | null): string[] | null => {
  const actionIds =
    nextEnforcementActionData
      ?.split(',')
      .map((actionId) => actionId.trim())
      .filter(Boolean) ?? [];

  if (actionIds.length === 1 && actionIds[0].toLowerCase() === FINES_ACC_ENF_ACTION_SELECT_ALL_PERMITTED_ACTIONS) {
    return null;
  }

  return actionIds;
};

/**
 * Resolves the next permitted enforcement actions by mapping the enforcement status payload to result ids.
 */
export const nextPermittedEnfActionsResolver: ResolveFn<IOpalFinesResultsRefData> = (route: ActivatedRouteSnapshot) => {
  const accountId = route.paramMap.get('accountId');
  const opalFinesService = inject(OpalFines);

  return opalFinesService.getDefendantAccountEnforcementStatus(Number(accountId)).pipe(
    map((enforcementStatus) => getNextPermittedActionIds(enforcementStatus.next_enforcement_action_data)),
    switchMap((nextPermittedActionIds) =>
      nextPermittedActionIds === null
        ? opalFinesService.getResults([], { enforcement: true, enforcement_override: false })
        : opalFinesService.getResults(nextPermittedActionIds),
    ),
  );
};
