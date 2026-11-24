import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { FinesAecPayloadService } from './fines-aec-payload.service';

describe('FinesAecPayloadService', () => {
  let service: FinesAecPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesAecPayloadService);
  });

  it('builds ordered account type rows from the API low and high enforcement paths', () => {
    const response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    response.enforcement_account_types.reverse();

    const rows = service.transformAccountTypesForView(response);

    expect(
      rows.map(({ id, accountType, minimumBalance, highValue }) => ({ id, accountType, minimumBalance, highValue })),
    ).toEqual([
      { id: 2, accountType: 'COL', minimumBalance: 100, highValue: 1000 },
      { id: 4, accountType: 'A', minimumBalance: 75, highValue: null },
      { id: 8, accountType: 'Y', minimumBalance: 50, highValue: 200 },
      { id: 6, accountType: 'CO', minimumBalance: 25, highValue: 500 },
    ]);
    expect(rows[0].lowValueAccountType).toMatchObject({ id: 2, version: 2, path: 'L' });
    expect(rows[0].highValueAccountType).toMatchObject({ id: 1, version: 1, path: 'H' });
  });
});
