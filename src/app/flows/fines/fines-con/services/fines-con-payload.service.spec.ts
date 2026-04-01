import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesConPayloadService } from './fines-con-payload.service';
import { FINES_CON_PAYLOAD_SERVICE_FORM_DATA_MOCK } from './mocks/fines-con-payload-service-form-data.mock';
import { FINES_CON_PAYLOAD_SERVICE_EXTRACT_RESPONSE_MOCK } from './mocks/fines-con-payload-service-extract-response.mock';
import { FINES_CON_PAYLOAD_SERVICE_DEFENDANT_ACCOUNTS_MOCK } from './mocks/fines-con-payload-service-defendant-accounts.mock';

describe('FinesConPayloadService', () => {
  let service: FinesConPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesConPayloadService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should build defendant accounts search payload', () => {
    const payload = service.buildDefendantAccountsSearchPayload(
      structuredClone(FINES_CON_PAYLOAD_SERVICE_FORM_DATA_MOCK),
      42,
      'individual',
    );

    expect(payload.business_unit_ids).toEqual([42]);
    expect(payload.reference_number).toEqual(
      expect.objectContaining({
        account_number: 'ACC-9',
      }),
    );
  });

  it('should extract defendant accounts from API response wrapper', () => {
    const accounts = service.extractDefendantAccounts(FINES_CON_PAYLOAD_SERVICE_EXTRACT_RESPONSE_MOCK);

    expect(accounts).toEqual(FINES_CON_PAYLOAD_SERVICE_EXTRACT_RESPONSE_MOCK.defendant_accounts);
  });

  it('should map defendant accounts and build checks map', () => {
    const tableRows = service.mapDefendantAccounts(FINES_CON_PAYLOAD_SERVICE_DEFENDANT_ACCOUNTS_MOCK);
    const checksByAccountId = service.buildChecksByAccountId(FINES_CON_PAYLOAD_SERVICE_DEFENDANT_ACCOUNTS_MOCK);

    expect(tableRows[0]).toEqual(
      expect.objectContaining({
        'Account ID': 11,
        Account: 'ACC001',
        Name: 'SMITH, John',
      }),
    );
    expect(checksByAccountId[11]).toEqual([{ reference: 'CON.ER.4', severity: 'error', message: 'Account blocked' }]);
  });
});
