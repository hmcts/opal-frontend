import { inject } from '@angular/core';
import { createUrlTreeFromSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, Observable } from 'rxjs';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';
import { FinesAecPayloadService } from '../../services/fines-aec-payload.service';
import { FINES_AEC_ROUTING_PATHS } from '../constants/fines-aec-routing-paths.constant';

/**
 * Resolves the selected account type from the cached national thresholds before opening the amend form.
 * @param route - Amend route identifying a displayed account type by its low-path ID.
 * @returns The selected row with both path records, or a redirect when the selected account type is unavailable.
 */
export const finesAecEnforcementAccountTypeResolver: ResolveFn<IFinesAecAccountTypeRow> = (
  route,
): Observable<IFinesAecAccountTypeRow | RedirectCommand> => {
  const opalFines = inject(OpalFines);
  const payloadService = inject(FinesAecPayloadService);
  const redirect = () =>
    new RedirectCommand(
      createUrlTreeFromSnapshot(route, ['../', FINES_AEC_ROUTING_PATHS.children.config], null, 'account-types'),
    );
  const selectedId = route.queryParamMap.get('enforcementAccountTypeId');

  return opalFines.getEnforcementAccountTypes().pipe(
    map((response) => {
      const row = payloadService
        .transformAccountTypesForView(response)
        .find((accountType) => String(accountType.id) === selectedId);

      return row?.highValueAccountType ? row : redirect();
    }),
  );
};
