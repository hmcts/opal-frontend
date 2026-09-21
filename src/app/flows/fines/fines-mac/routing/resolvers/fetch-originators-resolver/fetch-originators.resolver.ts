import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FINES_ACCOUNT_TYPES } from '@app/flows/fines/constants/fines-account-types.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, Observable } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { getFetchSendingCourtsLjaTypes } from '../fetch-sending-courts-resolver/helpers/fetch-sending-courts-lja-type.helper';
import { IFinesMacOriginatorRefData } from './interfaces/fines-mac-originator-ref-data.interface';

/**
 * Resolves and normalizes originator reference data for the Court details screen.
 * Conditional Caution accounts use prosecutors without requesting local justice areas;
 * Fine accounts use local justice areas filtered for the selected originator and account types.
 * @returns An observable containing normalized prosecutor or local justice area reference data.
 */
export const fetchOriginatorsResolver: ResolveFn<
  IFinesMacOriginatorRefData
> = (): Observable<IFinesMacOriginatorRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);
  const accountType = finesMacStore.accountDetails().formData.fm_create_account_account_type;

  if (accountType === FINES_ACCOUNT_TYPES['Conditional Caution']) {
    return opalFinesService.getProsecutors(finesMacStore.businessUnit().business_unit_id).pipe(
      map((prosecutors) => ({
        count: prosecutors.count,
        refData: prosecutors.ref_data.map((prosecutor) => ({
          originatorId: prosecutor.prosecutor_id,
          name: prosecutor.name,
          displayName: opalFinesService.getProsecutorPrettyName(prosecutor),
        })),
      })),
    );
  }

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
