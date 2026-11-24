import { describe, expect, it } from 'vitest';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { transformAccountTypesForView } from './fines-aec-payload-transform-account-types-for-view.utils';

describe('transformAccountTypesForView', () => {
  it('pairs low and high records in the specified account type order without changing the response', () => {
    const response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    response.enforcement_account_types.reverse();
    response.enforcement_account_types.push({
      id: 9,
      version: 1,
      account_type: 'CFP',
      enforcement_account_type: 'CFPL',
      path: 'L',
      minimum_balance: 10,
    });
    const originalResponse = structuredClone(response);

    const rows = transformAccountTypesForView(response);

    expect(
      rows.map(({ id, version, accountType, accountTypeName, minimumBalance, highValue }) => ({
        id,
        version,
        accountType,
        accountTypeName,
        minimumBalance,
        highValue,
      })),
    ).toEqual([
      {
        id: 2,
        version: 2,
        accountType: 'COL',
        accountTypeName: 'Adult - Collection order',
        minimumBalance: 100,
        highValue: 1000,
      },
      {
        id: 4,
        version: 4,
        accountType: 'A',
        accountTypeName: 'Adult - No collection order',
        minimumBalance: 75,
        highValue: null,
      },
      {
        id: 8,
        version: 8,
        accountType: 'Y',
        accountTypeName: 'Youth',
        minimumBalance: 50,
        highValue: 200,
      },
      {
        id: 6,
        version: 6,
        accountType: 'CO',
        accountTypeName: 'Company',
        minimumBalance: 25,
        highValue: 500,
      },
    ]);
    expect(rows[3].lowValueAccountType).toEqual(response.enforcement_account_types.find((record) => record.id === 6));
    expect(rows[3].highValueAccountType).toEqual(response.enforcement_account_types.find((record) => record.id === 5));
    expect(response).toEqual(originalResponse);
  });

  it('retains zero minimum and high values', () => {
    const response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    response.enforcement_account_types = response.enforcement_account_types.map((record) => ({
      ...record,
      minimum_balance: 0,
    }));

    const rows = transformAccountTypesForView(response);

    expect(rows).toHaveLength(4);
    expect(rows.every((row) => row.minimumBalance === 0 && row.highValue === 0)).toBe(true);
  });

  it('retains missing thresholds as null without creating a financial value', () => {
    const response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    response.enforcement_account_types = response.enforcement_account_types.filter((record) => record.id !== 1);
    delete response.enforcement_account_types.find((record) => record.id === 2)!.minimum_balance;

    const rows = transformAccountTypesForView(response);

    expect(rows[0]).toMatchObject({
      accountType: 'COL',
      minimumBalance: null,
      highValue: null,
      highValueAccountType: null,
    });
    expect(rows[1].highValue).toBeNull();
  });

  it('omits rows with no low enforcement path rather than fabricating an ID or minimum value', () => {
    const response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    response.enforcement_account_types = response.enforcement_account_types.filter((record) => record.id !== 2);

    expect(transformAccountTypesForView(response).map((row) => row.accountType)).toEqual(['A', 'Y', 'CO']);
    expect(transformAccountTypesForView({ enforcement_account_types: [] })).toEqual([]);
  });
});
