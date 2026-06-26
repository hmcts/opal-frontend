import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { finesSaSearchFetchMajorCreditorsResolver } from './fines-sa-search-fetch-major-creditors.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { firstValueFrom, Observable, of } from 'rxjs';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FinesSaStoreType } from '../../../../stores/types/fines-sa.type';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-central-funds-response.mock';
import { FinesSaPayloadService } from '../../../../services/fines-sa-payload.service';

describe('finesSaSearchFetchMajorCreditorsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesMajorCreditorRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesSaSearchFetchMajorCreditorsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesSaPayloadService: any;
  let mockFinesSaStore: FinesSaStoreType;
  const centralFundMajorCreditor = {
    account_number: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.account_number,
    business_unit_id: 1,
    creditor_account_id: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.creditor_account_id,
    creditor_account_type: 'CF',
    from_suspense: null,
    hold_payout: null,
    last_changed_date: null,
    major_creditor_code: null,
    major_creditor_id: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.creditor_account_id,
    major_creditor_party_id: null,
    name: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.name,
    postcode: null,
    prosecution_service: false,
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getMajorCreditors: vi.fn().mockName('OpalFines.getMajorCreditors'),
      getCentralFund: vi.fn().mockName('OpalFines.getCentralFund'),
    };
    mockOpalFinesService.getMajorCreditors.mockReturnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK));
    mockOpalFinesService.getCentralFund.mockReturnValue(of(OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK));
    mockFinesSaPayloadService = {
      mapCentralFundToMajorCreditor: vi
        .fn()
        .mockName('FinesSaPayloadService.mapCentralFundToMajorCreditor')
        .mockReturnValue(centralFundMajorCreditor),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesSaPayloadService, useValue: mockFinesSaPayloadService },
      ],
    });

    mockFinesSaStore = TestBed.inject(FinesSaStore);
  });

  it('should return {} when no business unit ids appear in store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);
    expect(result).toEqual({ count: 0, refData: [] } as IOpalFinesMajorCreditorRefData);
    expect(mockOpalFinesService.getMajorCreditors).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getCentralFund).not.toHaveBeenCalled();
  });

  it('should return {} when business unit ids is in store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFinesSaStore.setBusinessUnitIds([1, 2, 3]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);

    expect(result).toEqual({ count: 0, refData: [] } as IOpalFinesMajorCreditorRefData);
    expect(mockOpalFinesService.getMajorCreditors).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getCentralFund).not.toHaveBeenCalled();
  });

  it('should return major creditors and central fund when one business unit id is in store', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFinesSaStore.setBusinessUnitIds([1]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = {};

    const result = await firstValueFrom(executeResolver(route, state) as Observable<IOpalFinesMajorCreditorRefData>);

    expect(result).toEqual({
      count: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.count + 1,
      refData: [...OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData, centralFundMajorCreditor],
    });
    expect(mockOpalFinesService.getMajorCreditors).toHaveBeenCalledWith(1);
    expect(mockOpalFinesService.getCentralFund).toHaveBeenCalledWith(1);
    expect(mockFinesSaPayloadService.mapCentralFundToMajorCreditor).toHaveBeenCalledWith(
      OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK,
      1,
    );
  });
});
