import { describe, expect, it } from 'vitest';
import {
  buildChecksByAccountId,
  extractDefendantAccounts,
  mapDefendantAccounts,
} from './fines-con-payload-map-defendant-accounts.utils';
import { FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_OBJECT_MAP_MOCK } from './mocks/fines-con-payload-map-defendant-accounts-response-object-map.mock';
import { FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_INVALID_VALUE_MOCK } from './mocks/fines-con-payload-map-defendant-accounts-response-invalid-value.mock';
import { FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_FALLBACK_PROPERTIES_MOCK } from './mocks/fines-con-payload-map-defendant-accounts-fallback-properties.mock';
import { FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MIXED_IDS_MOCK } from './mocks/fines-con-payload-map-defendant-accounts-checks-mixed-ids.mock';
import { FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_ARRAY_MOCK } from './mocks/fines-con-payload-map-defendant-accounts-response-array.mock';
import { FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MISSING_FIELDS_MOCK } from './mocks/fines-con-payload-map-defendant-accounts-checks-missing-fields.mock';

describe('fines-con-payload-map-defendant-accounts utils', () => {
  it('should return empty array when response is null or non-object', () => {
    expect(extractDefendantAccounts(null)).toEqual([]);
    expect(extractDefendantAccounts('invalid')).toEqual([]);
  });

  it('should return response when response is already an array', () => {
    expect(extractDefendantAccounts(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_ARRAY_MOCK)).toEqual(
      FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_ARRAY_MOCK,
    );
  });

  it('should extract defendant accounts from object map values', () => {
    const accounts = extractDefendantAccounts(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_OBJECT_MAP_MOCK);

    expect(accounts).toHaveLength(2);
    expect(accounts[0]).toEqual(expect.objectContaining({ defendant_account_id: 1 }));
    expect(accounts[1]).toEqual(expect.objectContaining({ defendant_account_id: 2 }));
  });

  it('should return empty array when defendant_accounts is not array or object', () => {
    expect(extractDefendantAccounts(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_RESPONSE_INVALID_VALUE_MOCK)).toEqual([]);
  });

  it('should map defendant accounts with fallback properties', () => {
    const mapped = mapDefendantAccounts(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_FALLBACK_PROPERTIES_MOCK);

    expect(mapped[0]).toEqual(
      expect.objectContaining({
        'Account ID': 99,
        Account: 'ACC099',
        Name: 'DOE, John',
        CO: 'Y',
        'P/G': '-',
      }),
    );
  });

  it('should map enforcement using fallback properties', () => {
    const mapped = mapDefendantAccounts([
      {
        defendantAccountId: '77',
        lastEnforcementAction: 'reminder',
      },
    ] as never);

    expect(mapped[0]).toEqual(
      expect.objectContaining({
        'Account ID': 77,
        ENF: 'reminder',
      }),
    );
  });

  it('should default collection order to hyphen when no supported flag is true', () => {
    const mapped = mapDefendantAccounts([
      {
        defendantAccountId: '88',
        collectionOrder: false,
        has_collection_order: null,
        hasCollectionOrder: null,
      },
    ] as never);

    expect(mapped[0]).toEqual(
      expect.objectContaining({
        'Account ID': 88,
        CO: '-',
      }),
    );
  });

  it('should build checks map from snake_case and camelCase IDs and ignore missing IDs', () => {
    const result = buildChecksByAccountId(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MIXED_IDS_MOCK);

    expect(result[11]).toEqual([{ reference: 'CON.ER.1', severity: 'error', message: 'Error 1' }]);
    expect(result[12]).toEqual([{ reference: 'CON.WN.1', severity: 'warning', message: 'Warn 1' }]);
    expect(result[0]).toBeUndefined();
  });

  it('should drop checks where reference or message is missing', () => {
    const result = buildChecksByAccountId(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MISSING_FIELDS_MOCK);

    expect(result[31]).toEqual([]);
  });
});
