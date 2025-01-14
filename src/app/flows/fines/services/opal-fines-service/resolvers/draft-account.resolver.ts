import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { IFinesMacState } from '../../../fines-mac/interfaces/fines-mac-state.interface';
import { inject } from '@angular/core';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { OpalFines } from '../opal-fines.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { forkJoin, firstValueFrom } from 'rxjs';

export const draftAccountResolver: ResolveFn<IFinesMacState> = async (route: ActivatedRouteSnapshot) => {
  const globalStateService = inject(GlobalStateService);
  const opalFinesService = inject(OpalFines);
  const finesService = inject(FinesService);
  const finesMacPayloadService = inject(FinesMacPayloadService);

  // Extract the `draftAccountId` from the route parameters
  const draftAccountId = Number(route.paramMap.get('draftAccountId'));

  try {
    // Fetch the draft account details using its ID
    const draftAccount = await firstValueFrom(opalFinesService.getDraftAccountById(draftAccountId));

    // Store the fetched draft account data in the `finesDraftState`
    finesService.finesDraftState = draftAccount;

    // Map the draft account data into the `finesMacState` format for further processing
    finesService.finesMacState = finesMacPayloadService.mapAccountPayload(draftAccount);

    // Fetch the business unit details based on the business unit ID in the `finesMacState`
    const businessUnit = await firstValueFrom(
      opalFinesService.getBusinessUnitById(
        finesService.finesMacState.accountDetails.formData.fm_create_account_business_unit_id!,
      ),
    );

    // If no business unit is found, throw an error
    if (!businessUnit) {
      throw new Error('Cannot find business unit');
    }

    // Map the fetched business unit data to the required format in `finesMacState`
    finesService.finesMacState.businessUnit = {
      business_unit_code: businessUnit.businessUnitCode,
      business_unit_type: businessUnit.businessUnitType,
      account_number_prefix: businessUnit.accountNumberPrefix,
      opal_domain: businessUnit.opalDomain,
      business_unit_id: businessUnit.businessUnitId,
      business_unit_name: businessUnit.businessUnitName,
      configurationItems: businessUnit.configurationItems.map((item) => ({
        item_name: item.itemName,
        item_value: item.itemValue,
        item_values: item.itemValues,
      })),
      welsh_language: businessUnit.welshLanguage,
    };

    // Prepare an array of Observables for fetching offence data in parallel
    const offenceObservables = finesService.finesMacState.offenceDetails.map((offence) =>
      opalFinesService.getOffenceById(offence.formData.fm_offence_details_offence_id!),
    );

    // Execute all offence data fetch requests in parallel using `forkJoin`
    const offenceDataArray = await firstValueFrom(forkJoin(offenceObservables));

    // Map the fetched offence data back to the corresponding offence in `finesMacState`
    finesService.finesMacState.offenceDetails.forEach((offence, index) => {
      offence.formData.fm_offence_details_offence_cjs_code = offenceDataArray[index].cjsCode;
    });
  } catch (error) {
    // If any error occurs, set the error state in the `globalStateService` and rethrow the error
    const err = error as Error;
    globalStateService.error.set({
      error: true,
      message: err.message || 'An error occurred while processing the draft account resolver',
    });
    throw error;
  }

  // Return the final `finesMacState` containing all processed data
  return finesService.finesMacState;
};
