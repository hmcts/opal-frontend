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

  it('prepares the selected row for editing and builds a payload that clears its high value', () => {
    const row = service.transformAccountTypesForView(structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK))[0];

    const formState = service.transformAccountTypeToAmendValuesForm(row);
    expect(formState).toEqual({ minimum_balance: '100.00', high_value: '1000.00' });
    formState.minimum_balance = '125.50';
    formState.high_value = '';

    expect(service.buildAmendValuesPayload(row, formState)).toEqual([
      { id: 2, minimum_balance: 125.5, version: 2 },
      { id: 1, minimum_balance: null, version: 1 },
    ]);
    expect(row.minimumBalance).toBe(100);
    expect(row.highValue).toBe(1000);
  });
});
