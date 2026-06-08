import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { catchError, of } from 'rxjs';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';
import { createDefendantDetailsRedirect } from '../helpers/fines-acc-resolver-redirect';

/**
 * Resolves the selected enforcement result for the add-action journey or redirects back to enforcement details.
 */
export const enforcementActionResultResolver: ResolveFn<IOpalFinesResultRefData | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const resultId = route.queryParamMap.get('resultId');
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);

  if (!resultId) {
    return createDefendantDetailsRedirect(router, FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement);
  }

  return opalFinesService.getResult(resultId, true).pipe(
    catchError(() => {
      return of(createDefendantDetailsRedirect(router, FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement));
    }),
  );
};
