import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { RELEASE_1A_1_1_FEATURE_FLAG } from '@app/flows/fines/constants/release-feature-flags.constant';
import { resolveFeatureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { getProsecutorIdentifier } from '@services/fines/opal-fines-service/utils/opal-fines-prosecutor.utils';
import { resolveAppMode } from '@app/flows/fines/routing/guards/helpers/resolve-app-mode.helper';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { getFetchSendingCourtsLjaTypes } from '../fetch-sending-courts-resolver/helpers/fetch-sending-courts-lja-type.helper';
import { IFinesMacOriginatorRefData } from './interfaces/fines-mac-originator-ref-data.interface';

/**
 * Resolves and normalizes account-type-specific originator reference data.
 * Fine accounts always use local justice areas. Conditional Caution and Fixed Penalty accounts
 * use their original originator sources until the release-1a-1-1 feature flag is enabled, when
 * both account types use prosecutors only.
 * @returns An observable containing normalized prosecutor, local justice area, or combined originator data.
 */
export const fetchOriginatorsResolver: ResolveFn<IFinesMacOriginatorRefData> = (
  route,
  state,
): Observable<IFinesMacOriginatorRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);
  const accountType = finesMacStore.accountDetails().formData.fm_create_account_account_type;

  const fetchProsecutorOriginators = (appMode: string): Observable<IFinesMacOriginatorRefData> =>
    opalFinesService.getProsecutors(finesMacStore.businessUnit().business_unit_id).pipe(
      map((prosecutors) => {
        const refData = prosecutors.ref_data.flatMap((prosecutor) => {
          const originatorId = getProsecutorIdentifier(prosecutor, appMode);

          return originatorId === undefined
            ? []
            : [
                {
                  originatorId,
                  name: prosecutor.name,
                  displayName: opalFinesService.getProsecutorPrettyName(prosecutor),
                },
              ];
        });

        return { count: refData.length, refData };
      }),
    );

  const fetchLocalJusticeAreaOriginators = (): Observable<IFinesMacOriginatorRefData> => {
    const originatorType = finesMacStore.originatorType().formData.fm_originator_type_originator_type;
    const ljaTypes = getFetchSendingCourtsLjaTypes(originatorType, accountType);
    const localJusticeAreas$ = ljaTypes.length
      ? opalFinesService.getLocalJusticeAreas(ljaTypes)
      : opalFinesService.getLocalJusticeAreas();

    return localJusticeAreas$.pipe(
      map((localJusticeAreas) => ({
        count: localJusticeAreas.count,
        refData: localJusticeAreas.refData.map((localJusticeArea) => ({
          originatorId: localJusticeArea.local_justice_area_id,
          name: localJusticeArea.name,
          displayName: opalFinesService.getLocalJusticeAreaPrettyName(localJusticeArea),
        })),
      })),
    );
  };

  if (accountType === FINES_ACCOUNT_TYPES.Fine) {
    return fetchLocalJusticeAreaOriginators();
  }

  return forkJoin({
    release1a1_1Enabled: from(resolveFeatureFlagGuard(RELEASE_1A_1_1_FEATURE_FLAG, route, state)),
    appMode: from(resolveAppMode()),
  }).pipe(
    switchMap(({ release1a1_1Enabled, appMode }) => {
      if (
        release1a1_1Enabled &&
        (accountType === FINES_ACCOUNT_TYPES['Conditional Caution'] ||
          accountType === FINES_ACCOUNT_TYPES['Fixed Penalty'])
      ) {
        return fetchProsecutorOriginators(appMode);
      }

      if (accountType === FINES_ACCOUNT_TYPES['Fixed Penalty']) {
        return forkJoin([fetchProsecutorOriginators(appMode), fetchLocalJusticeAreaOriginators()]).pipe(
          map(([prosecutors, localJusticeAreas]) => ({
            count: prosecutors.count + localJusticeAreas.count,
            refData: [...prosecutors.refData, ...localJusticeAreas.refData],
          })),
        );
      }

      return fetchLocalJusticeAreaOriginators();
    }),
  );
};
