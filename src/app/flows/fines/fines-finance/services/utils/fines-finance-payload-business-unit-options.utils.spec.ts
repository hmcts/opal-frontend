import { describe, expect, it } from 'vitest';
import type { IOpalUserBusinessUnitUser } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from '../../fines-finance-inbound-files/mocks/fines-finance-business-unit-ref-data.mock';
import {
  getPermittedBusinessUnitOptions,
  mapBusinessUnitsToOptions,
} from './fines-finance-payload-business-unit-options.utils';

describe('Finance business-unit options', () => {
  it('sorts name/ID pairs without mutating the API reference data', () => {
    const units = FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    const original = structuredClone(units);
    expect(mapBusinessUnitsToOptions(units)).toEqual([
      { name: 'Camberwell Green', value: '77' },
      { name: 'Camden and Islington', value: '65' },
      { name: 'N E Region', value: '78' },
      { name: 'West London', value: '73' },
    ]);
    expect(units).toEqual(original);
    expect(mapBusinessUnitsToOptions([])).toEqual([]);
  });

  it('requires the view-interface-files permission for a matching business-unit ID', () => {
    const users: IOpalUserBusinessUnitUser[] = [
      {
        business_unit_user_id: 'user-77',
        business_unit_id: 77,
        permissions: [{ permission_id: 18, permission_name: 'View Interface Files' }],
      },
      {
        business_unit_user_id: 'user-78',
        business_unit_id: 78,
        permissions: [{ permission_id: 1, permission_name: 'Other' }],
      },
      { business_unit_user_id: 'user-65', business_unit_id: 65, permissions: [] },
      {
        business_unit_user_id: 'user-999',
        business_unit_id: 999,
        permissions: [{ permission_id: 18, permission_name: 'View Interface Files' }],
      },
    ];
    expect(getPermittedBusinessUnitOptions(FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData, users)).toEqual([
      { name: 'Camberwell Green', value: '77' },
    ]);
  });

  it.each([undefined, null, []])('returns no filter choices when memberships are %s', (users) => {
    expect(getPermittedBusinessUnitOptions(FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData, users)).toEqual([]);
  });
});
