import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { RELEASE_1A_1_1_FEATURE_FLAG } from '@app/flows/fines/constants/release-feature-flags.constant';
import { resolveFeatureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { getFetchSendingCourtsLjaTypes } from '../fetch-sending-courts-resolver/helpers/fetch-sending-courts-lja-type.helper';
import { IFinesMacOriginatorRefData } from './interfaces/fines-mac-originator-ref-data.interface';

/**
 * Resolves and normalizes account-type-specific originator reference data.
 * Fine accounts always use local justice areas. Conditional Caution and Fixed Penalty accounts
 * use their original originator sources until the release-1a-1.1 feature flag is enabled, when
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

  const fetchProsecutorOriginators = (): Observable<IFinesMacOriginatorRefData> =>
    opalFinesService.getProsecutors(finesMacStore.businessUnit().business_unit_id).pipe(
      map((prosecutors) => ({
        count: prosecutors.count,
        refData: prosecutors.ref_data.map((prosecutor) => ({
          originatorId: prosecutor.prosecutor_id,
          name: prosecutor.name,
          displayName: opalFinesService.getProsecutorPrettyName(prosecutor),
        })),
      })),
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

  return from(resolveFeatureFlagGuard(RELEASE_1A_1_1_FEATURE_FLAG, route, state)).pipe(
    switchMap((release1a1_1Enabled) => {
      if (
        release1a1_1Enabled &&
        (accountType === FINES_ACCOUNT_TYPES['Conditional Caution'] ||
          accountType === FINES_ACCOUNT_TYPES['Fixed Penalty'])
      ) {
        return fetchProsecutorOriginators();
      }

      if (accountType === FINES_ACCOUNT_TYPES['Fixed Penalty']) {
        return forkJoin([fetchProsecutorOriginators(), fetchLocalJusticeAreaOriginators()]).pipe(
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
