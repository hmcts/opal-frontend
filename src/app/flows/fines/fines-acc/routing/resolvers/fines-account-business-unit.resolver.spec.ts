import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from '../../fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';
import { FinesAccountBusinessUnitResolver } from './fines-account-business-unit.resolver';
import {
  FINES_ACCOUNT_ROUTE_TYPES,
  FinesAccountRouteType,
} from '../../../constants/fines-account-route-types.constant';

function createRoute(accountId?: number, accountType?: FinesAccountRouteType): ActivatedRouteSnapshot {
  return {
    data: accountType === undefined ? {} : { accountType },
    paramMap: convertToParamMap(accountId === undefined ? {} : { accountId: accountId.toString() }),
    params: accountId === undefined ? {} : { accountId: accountId.toString() },
  } as ActivatedRouteSnapshot;
}

async function resolveBusinessUnit(route: ActivatedRouteSnapshot): Promise<number | null> {
  const result = TestBed.runInInjectionContext(() =>
    TestBed.inject(FinesAccountBusinessUnitResolver).resolveBusinessUnitId(route),
  );
  return isObservable(result) ? firstValueFrom(result) : Promise.resolve(result);
}

describe('finesAccountBusinessUnitResolver', () => {
  let mockAccountStore: {
    account_id: ReturnType<typeof vi.fn>;
    business_unit_id: ReturnType<typeof vi.fn>;
    setAccountState: ReturnType<typeof vi.fn>;
  };
  let mockOpalFinesService: {
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
    getMinorCreditorAccountHeadingData: ReturnType<typeof vi.fn>;
  };
  let mockPayloadService: {
    transformDefendantAccountHeaderForStore: ReturnType<typeof vi.fn>;
    transformMinorCreditorAccountHeaderForStore: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAccountStore = {
      account_id: vi.fn().mockName('FinesAccountStore.account_id'),
      business_unit_id: vi.fn().mockName('FinesAccountStore.business_unit_id'),
      setAccountState: vi.fn().mockName('FinesAccountStore.setAccountState'),
    };
    mockOpalFinesService = {
      getDefendantAccountHeadingData: vi.fn().mockName('OpalFines.getDefendantAccountHeadingData'),
      getMinorCreditorAccountHeadingData: vi.fn().mockName('OpalFines.getMinorCreditorAccountHeadingData'),
    };
    mockPayloadService = {
      transformDefendantAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformDefendantAccountHeaderForStore'),
      transformMinorCreditorAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformMinorCreditorAccountHeaderForStore'),
    };

    mockAccountStore.account_id.mockReturnValue(null);
    mockAccountStore.business_unit_id.mockReturnValue(null);
    mockAccountStore.setAccountState.mockReturnValue(undefined);
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK));
    mockOpalFinesService.getMinorCreditorAccountHeadingData.mockReturnValue(
      of(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
    );
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    mockPayloadService.transformMinorCreditorAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);

    TestBed.configureTestingModule({
      providers: [
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    });
  });

  it('should return the stored business unit when the current account matches the route', async () => {
    mockAccountStore.account_id.mockReturnValue(123);
    mockAccountStore.business_unit_id.mockReturnValue('456');
    const route = createRoute(123, FINES_ACCOUNT_ROUTE_TYPES.defendant);

    const result = await resolveBusinessUnit(route);

    expect(result).toBe(456);
    expect(mockOpalFinesService.getDefendantAccountHeadingData).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).not.toHaveBeenCalled();
    expect(mockAccountStore.setAccountState).not.toHaveBeenCalled();
  });

  it('should fetch the defendant heading and hydrate the store when the current account does not match', async () => {
    mockAccountStore.account_id.mockReturnValue(999);
    mockAccountStore.business_unit_id.mockReturnValue('321');
    const route = createRoute(123, FINES_ACCOUNT_ROUTE_TYPES.defendant);

    const result = await resolveBusinessUnit(route);

    expect(result).toBe(Number(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.business_unit_summary.business_unit_id));
    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(123);
    expect(mockPayloadService.transformDefendantAccountHeaderForStore).toHaveBeenCalledWith(
      123,
      FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
    );
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
  });

  it('should fetch the minor creditor heading and hydrate the store when the current account does not match', async () => {
    mockAccountStore.account_id.mockReturnValue(999);
    mockAccountStore.business_unit_id.mockReturnValue('321');
    const route = createRoute(123, FINES_ACCOUNT_ROUTE_TYPES.minorCreditor);

    const result = await resolveBusinessUnit(route);

    expect(result).toBe(Number(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK.business_unit.business_unit_id));
    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).toHaveBeenCalledWith(123);
    expect(mockPayloadService.transformMinorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      123,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
  });

  it('should return null when the account id is missing', async () => {
    const route = createRoute(undefined, FINES_ACCOUNT_ROUTE_TYPES.defendant);

    const result = await resolveBusinessUnit(route);

    expect(result).toBeNull();
    expect(mockOpalFinesService.getDefendantAccountHeadingData).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).not.toHaveBeenCalled();
  });

  it('should return null when the account type is not supported', async () => {
    const route = createRoute(123);

    const result = await resolveBusinessUnit(route);

    expect(result).toBeNull();
    expect(mockOpalFinesService.getDefendantAccountHeadingData).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).not.toHaveBeenCalled();
  });
});
