import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesFinanceInterfaceFilesPayloadService } from './fines-finance-interface-files-payload.service';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from '../mocks/fines-finance-business-unit-ref-data.mock';

describe('FinesFinanceInterfaceFilesPayloadService', () => {
  let service: FinesFinanceInterfaceFilesPayloadService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GlobalStore,
          useValue: {
            userState: () => ({
              business_unit_users: [{ business_unit_id: 77, permissions: [{ permission_id: 18 }] }],
            }),
          },
        },
      ],
    });
    service = TestBed.inject(FinesFinanceInterfaceFilesPayloadService);
  });

  it('maps all business-unit codes to alphabetic display labels', () => {
    expect(service.mapBusinessUnitsToOptions(FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData)).toEqual([
      { name: 'Camberwell Green', value: '0046' },
      { name: 'Camden and Islington', value: '0034' },
      { name: 'N E Region', value: '0047' },
      { name: 'West London', value: '0042' },
    ]);
  });

  it('uses current-user permissions for business-unit filter choices', () => {
    expect(service.getPermittedBusinessUnitOptions(FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData)).toEqual([
      { name: 'Camberwell Green', value: '0046' },
    ]);
  });
});
