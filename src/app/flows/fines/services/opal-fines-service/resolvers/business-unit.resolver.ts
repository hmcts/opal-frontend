import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitRefData,
} from '../interfaces/opal-fines-business-unit-ref-data.interface';
import { OpalFines } from '../opal-fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';

// TODO: this needs changed to use the GET /business-units/{business-unit-id} endpoint
// Defect raised against Fines Service as this endpoint is camel case not snake case
export const businessUnitResolver: ResolveFn<IOpalFinesBusinessUnit | null> = async (route: ActivatedRouteSnapshot) => {
  const globalStateService = inject(GlobalStateService);
  const opalFinesService = inject(OpalFines);
  const noBusinessUnit = 'Cannot find business unit';
  const errorMessage = 'An error occurred whilst trying to get business units';

  const businessUnitId = Number(route.paramMap.get('businessUnitId'));
  try {
    // Fetch business unit ref data
    const refData: IOpalFinesBusinessUnitRefData = await firstValueFrom(
      opalFinesService.getBusinessUnits('CREATE_MANAGE_DRAFT_ACCOUNTS'),
    );

    // Find and return the matching business unit
    const businessUnit = refData.refData.find((unit) => unit.business_unit_id === businessUnitId);

    if (!businessUnit) {
      globalStateService.error.set({ error: true, message: noBusinessUnit });
      throw new Error(noBusinessUnit);
    }

    return businessUnit;
  } catch (error) {
    globalStateService.error.set({ error: true, message: errorMessage });
    throw new Error(errorMessage + error);
  }
};
