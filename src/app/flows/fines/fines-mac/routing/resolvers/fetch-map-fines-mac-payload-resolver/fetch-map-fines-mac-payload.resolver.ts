import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from '../../../services/fines-mac-payload/fines-mac-payload.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { IFetchMapFinesMacPayload } from './interfaces/fetch-map-fines-mac-payload.interface';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../../fines-mac-offence-details/constants/fines-mac-offence-details-result-codes.constant';

export const fetchMapFinesMacPayloadResolver: ResolveFn<IFetchMapFinesMacPayload> = async (
  route: ActivatedRouteSnapshot,
) => {
  const globalStore = inject(GlobalStore);
  const opalFinesService = inject(OpalFines);
  const finesMacPayloadService = inject(FinesMacPayloadService);

  // Extract the `draftAccountId` from the route parameters
  const draftAccountId = Number(route.paramMap.get('draftAccountId'));

  try {
    // Fetch the draft account, business unit, and offences in parallel to optimize performance
    const draftAccount = await firstValueFrom(opalFinesService.getDraftAccountById(draftAccountId));

    // Validate and fetch business unit details
    const businessUnitId = draftAccount.business_unit_id;
    if (!businessUnitId) {
      throw new Error(`Business unit ID is missing for draftAccountId: ${draftAccountId}`);
    }
    const businessUnit = await firstValueFrom(opalFinesService.getBusinessUnitById(businessUnitId));

    if (!businessUnit) {
      throw new Error(`Cannot find business unit for ID: ${businessUnitId}`);
    }

    // Fetch all offence data in parallel
    const offences = draftAccount.account.offences || [];
    const offencesData = offences.length
      ? await firstValueFrom(forkJoin(offences.map((offence) => opalFinesService.getOffenceById(offence.offence_id!))))
      : [];

    const finesMacState = finesMacPayloadService.mapAccountPayload(draftAccount, businessUnit, offencesData);

    // Fetch courts, major creditors, local justice areas, results, and prosecutors data
    const [courts, majorCreditors, localJusticeAreas, results, prosecutors] = await firstValueFrom(
      forkJoin([
        opalFinesService.getCourts(businessUnitId),
        opalFinesService.getMajorCreditors(businessUnitId),
        opalFinesService.getLocalJusticeAreas(),
        opalFinesService.getResults(Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES)),
        opalFinesService.getProsecutors(businessUnitId),
      ]),
    );

    // Return all fetched data as an object
    return { finesMacState, finesMacDraft: draftAccount, courts, majorCreditors, localJusticeAreas, results, prosecutors };
  } catch (error) {
    // Log and rethrow the error
    globalStore.setError({
      error: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
    throw error;
  }
};
