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

  it('should build checks map from snake_case and camelCase IDs and ignore missing IDs', () => {
    const result = buildChecksByAccountId(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MIXED_IDS_MOCK);

    expect(result[11]).toEqual([{ reference: 'CON.ER.1', severity: 'error', message: 'Error 1' }]);
    expect(result[12]).toEqual([{ reference: 'CON.WN.1', severity: 'warning', message: 'Warn 1' }]);
    expect(result[0]).toBeUndefined();
  });

  it('should map company name and aliases from organisation fields', () => {
    const mapped = mapDefendantAccounts([
      {
        defendant_account_id: 201,
        account_number: 'COMP201',
        organisation_flag: true,
        aliases: [
          { alias_number: 2, organisation_name: 'Bravo Ltd', surname: null, forenames: null },
          { alias_number: 1, organisation_name: 'Alpha Ltd', surname: null, forenames: null },
        ],
        address_line_1: null,
        postcode: null,
        business_unit_name: null,
        business_unit_id: null,
        prosecutor_case_reference: null,
        last_enforcement_action: null,
        account_balance: null,
        organisation_name: 'Acme Corp',
        defendant_title: null,
        defendant_firstnames: null,
        defendant_surname: null,
        birth_date: null,
        national_insurance_number: null,
        parent_guardian_surname: null,
        parent_guardian_firstnames: null,
      },
    ]);

    expect(mapped[0]).toEqual(
      expect.objectContaining({
        Name: 'Acme Corp',
        Aliases: 'Alpha Ltd\nBravo Ltd',
      }),
    );
  });

  it('should prefer organisation name when present even if organisation flag is false', () => {
    const mapped = mapDefendantAccounts([
      {
        defendant_account_id: 301,
        account_number: 'COMP301',
        organisation_flag: false,
        aliases: [{ alias_number: 1, organisation_name: 'Org Alias', surname: 'Ignored', forenames: 'Name' }],
        address_line_1: null,
        postcode: null,
        business_unit_name: null,
        business_unit_id: null,
        prosecutor_case_reference: null,
        last_enforcement_action: null,
        account_balance: null,
        organisation_name: 'Preferred Org Name',
        defendant_title: null,
        defendant_firstnames: 'John',
        defendant_surname: 'Doe',
        birth_date: null,
        national_insurance_number: null,
        parent_guardian_surname: null,
        parent_guardian_firstnames: null,
      },
    ]);

    expect(mapped[0]).toEqual(
      expect.objectContaining({
        Name: 'Preferred Org Name',
        Aliases: 'Org Alias',
      }),
    );
  });

  it('should drop checks where reference or message is missing', () => {
    const result = buildChecksByAccountId(FINES_CON_PAYLOAD_MAP_DEFENDANT_ACCOUNTS_CHECKS_MISSING_FIELDS_MOCK);

    expect(result[31]).toEqual([]);
  });
});
