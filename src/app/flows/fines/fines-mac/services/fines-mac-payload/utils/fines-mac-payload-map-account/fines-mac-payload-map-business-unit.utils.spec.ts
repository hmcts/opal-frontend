import { finesMacPayloadMapBusinessUnit } from './fines-mac-payload-map-business-unit.utils';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from '../../mocks/fines-mac-payload-fines-mac-state.mock';

describe('finesMacPayloadMapBusinessUnit', () => {
  it('should map business unit reference data to fines MAC state', () => {
    const finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);

    const businessUnitRefData = structuredClone(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK);

    const expectedState = {
      ...structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE),
      businessUnit: {
        business_unit_code: businessUnitRefData.businessUnitCode,
        business_unit_type: businessUnitRefData.businessUnitType,
        account_number_prefix: businessUnitRefData.accountNumberPrefix,
        opal_domain: businessUnitRefData.opalDomain,
        business_unit_id: businessUnitRefData.businessUnitId,
        business_unit_name: businessUnitRefData.businessUnitName,
        configurationItems: businessUnitRefData.configurationItems.map((item) => ({
          item_name: item.itemName,
          item_value: item.itemValue,
          item_values: item.itemValues,
        })),
        welsh_language: businessUnitRefData.welshLanguage,
      },
    };

    const result = finesMacPayloadMapBusinessUnit(finesMacState, businessUnitRefData);
    expect(result).toEqual(expectedState);
  });
});
