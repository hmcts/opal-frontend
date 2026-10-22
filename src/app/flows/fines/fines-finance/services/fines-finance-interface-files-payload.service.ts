import { inject, Injectable } from '@angular/core';
import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import type { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import {
  getPermittedBusinessUnitOptions,
  mapBusinessUnitsToOptions,
} from './utils/fines-finance-payload-business-unit-options.utils';

/** Maps shared business-unit display labels and permitted filter choices for both Finance file pages. */
@Injectable({ providedIn: 'root' })
export class FinesFinanceInterfaceFilesPayloadService {
  private readonly globalStore = inject(GlobalStore);

  /**
   * Resolves every business-unit name for displaying returned API codes.
   * @param businessUnits - Resolved business-unit reference data.
   * @returns Alphabetic name/code options, preserving leading zeros.
   */
  public mapBusinessUnitsToOptions(businessUnits: IOpalFinesBusinessUnit[]): IAlphagovAccessibleAutocompleteItem[] {
    return mapBusinessUnitsToOptions(businessUnits);
  }

  /**
   * Limits filter choices to business units where the current user can view interface files.
   * @param businessUnits - Resolved business-unit reference data.
   * @returns Permitted alphabetic name/code options.
   */
  public getPermittedBusinessUnitOptions(
    businessUnits: IOpalFinesBusinessUnit[],
  ): IAlphagovAccessibleAutocompleteItem[] {
    return getPermittedBusinessUnitOptions(businessUnits, this.globalStore.userState().business_unit_users);
  }
}
