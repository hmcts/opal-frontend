import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { FINES_MAC_BUSINESS_UNIT_STATE } from '../../../../constants/fines-mac-business-unit-state';

/**
 * Maps the business unit reference data to the fines MAC state.
 *
 * @param {IFinesMacState} mappedFinesMacState - The current state of the fines MAC.
 * @param {IOpalFinesBusinessUnitNonSnakeCase} businessUnitRefData - The reference data for the business unit.
 * @returns {IFinesMacState} - The updated fines MAC state with the mapped business unit data.
 */
const mapBusinessUnit = (
  mappedFinesMacState: IFinesMacState,
  businessUnitRefData: IOpalFinesBusinessUnitNonSnakeCase,
): IFinesMacState => {
  mappedFinesMacState.businessUnit = {
    ...FINES_MAC_BUSINESS_UNIT_STATE,
    business_unit_code: businessUnitRefData.businessUnitCode,
    business_unit_type: businessUnitRefData.businessUnitType,
    account_number_prefix: businessUnitRefData.accountNumberPrefix,
    opal_domain: businessUnitRefData.opalDomain,
    business_unit_id: businessUnitRefData.businessUnitId,
    business_unit_name: businessUnitRefData.businessUnitName,
    welsh_language: businessUnitRefData.welshLanguage,
    configurationItems: businessUnitRefData.configurationItems.map((item) => ({
      item_name: item.itemName,
      item_value: item.itemValue,
      item_values: item.itemValues,
    })),
  };
  return mappedFinesMacState;
};

/**
 * Maps the business unit reference data to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param businessUnitRefData - The reference data for the business unit.
 * @returns The updated fines MAC state with the mapped business unit data.
 */
export const finesMacPayloadMapBusinessUnit = (
  mappedFinesMacState: IFinesMacState,
  businessUnitRefData: IOpalFinesBusinessUnitNonSnakeCase,
): IFinesMacState => {
  return mapBusinessUnit(mappedFinesMacState, businessUnitRefData);
};
