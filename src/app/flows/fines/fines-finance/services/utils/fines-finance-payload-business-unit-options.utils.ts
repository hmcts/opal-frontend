import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { IOpalUserBusinessUnitUser } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import type { IOpalFinesBusinessUnit } from '../../../services/opal-fines-service/interfaces/opal-fines-business-unit.interface';

/**
 * Maps business-unit reference data to alphabetic name/code options without mutating it.
 * @param businessUnits - Business units used for filter choices or display labels.
 * @returns Name/code options preserving leading zeros in the API codes.
 */
export function mapBusinessUnitsToOptions(
  businessUnits: IOpalFinesBusinessUnit[],
): IAlphagovAccessibleAutocompleteItem[] {
  return businessUnits
    .map((item) => ({ value: item.business_unit_code, name: item.business_unit_name }))
    .sort((first, second) => first.name.localeCompare(second.name));
}

/**
 * Resolves filter choices only for business units where the user may view interface files.
 * @param businessUnits - All resolved business units.
 * @param businessUnitUsers - Current business-unit memberships and their permissions.
 * @returns Permitted business units as alphabetic name/code choices.
 */
export function getPermittedBusinessUnitOptions(
  businessUnits: IOpalFinesBusinessUnit[],
  businessUnitUsers: IOpalUserBusinessUnitUser[] | null | undefined,
): IAlphagovAccessibleAutocompleteItem[] {
  const permittedIds = new Set(
    (businessUnitUsers ?? [])
      .filter((user) =>
        user.permissions.some((permission) => permission.permission_id === FINES_PERMISSIONS['view-interface-files']),
      )
      .map((user) => user.business_unit_id),
  );
  return mapBusinessUnitsToOptions(businessUnits.filter((item) => permittedIds.has(item.business_unit_id)));
}
