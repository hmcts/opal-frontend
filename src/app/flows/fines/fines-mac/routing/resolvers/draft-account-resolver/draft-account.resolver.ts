import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '../../../../services/opal-fines-service/opal-fines.service';
import { forkJoin, firstValueFrom } from 'rxjs';
import { IDraftAccountResolver } from './interfaces/draft-account-resolver.interface';
import { GlobalStore } from '@stores/global/global.store';

export const draftAccountResolver: ResolveFn<IDraftAccountResolver> = async (route: ActivatedRouteSnapshot) => {
  const globalStore = inject(GlobalStore);
  const opalFinesService = inject(OpalFines);

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

    // Return all fetched data as an object
    return { draftAccount, businessUnit, offencesData };
  } catch (error) {
    // Log and rethrow the error
    globalStore.setError({
      error: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
    throw error;
  }
};
