import { TestBed } from '@angular/core/testing';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesFinancePayloadService } from './fines-finance-payload.service';
import { FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE } from '../constants/fines-finance-inbound-files-initial-filter-state.constant';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from '../fines-finance-inbound-files/mocks/fines-finance-business-unit-ref-data.mock';
import { FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK } from '../fines-finance-inbound-files/mocks/fines-finance-inbound-files-response.mock';

describe('FinesFinancePayloadService', () => {
  let service: FinesFinancePayloadService;
  let previousZone: typeof Settings.defaultZone;
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
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
    service = TestBed.inject(FinesFinancePayloadService);
  });
  afterEach(() => {
    Settings.defaultZone = previousZone;
    vi.useRealTimers();
  });

  it('builds the initial inbound API restrictions and inclusive date range', () => {
    expect(service.buildInboundFilesSearchParams({ ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE })).toEqual({
      domain: 'FINES',
      target: 'OPAL',
      type: ['SOURCE', 'TRANSFORMED_JSON'],
      not_status: ['FAILED_SUPERSEDED'],
      from_date: '2026-10-13T23:00:00',
      to_date: '2026-10-20T22:59:59.999999',
    });
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

  it('supplies Finance source/type labels and date formatting when mapping rows', () => {
    const options = service.mapBusinessUnitsToOptions(FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData);
    expect(
      service.mapInboundFilesToTableData(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files, options)[0],
    ).toEqual({
      'File ID': 1001,
      'Date and time': Date.parse('2026-10-20T12:00:00Z'),
      dateTimeDisplay: '20 Oct 2026 at 13:00',
      Title: 'allpay_1001.xml',
      Type: 'RAW',
      'Business unit': 'Camberwell Green',
      Source: 'Allpay',
      Status: 'Ready',
      Actions: null,
    });
  });
});
