import { TestBed } from '@angular/core/testing';
import { RedirectCommand, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { defendantAccountPartyResolver } from './defendant-account-party.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../constants/fines-acc-defendant-routing-paths.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('defendantAccountPartyResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getDefendantAccountParty: vi.fn().mockName('OpalFines.getDefendantAccountParty'),
      getDefendantAccountHeadingData: vi.fn().mockName('OpalFines.getDefendantAccountHeadingData'),
    };
    mockPayloadService = {
      mapDebtorAccountPartyPayload: vi.fn().mockName('FinesAccPayloadService.mapDebtorAccountPartyPayload'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
    };
    mockRouter = {
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should return a RedirectCommand when accountId is missing', () => {
    const route = {
      paramMap: {
        get: vi.fn().mockReturnValue(null),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
  });

  it('should return observable with transformed form data on successful API call with individual party', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'individual';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: 'GUARDIAN456',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const mockDefendantData = {
      defendant_account_party: {
        is_debtor: true,
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTransformedData = {} as any;

    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.mockReturnValue(of(mockDefendantData));
    mockPayloadService.transformPayload.mockReturnValue(mockDefendantData);
    mockPayloadService.mapDebtorAccountPartyPayload.mockReturnValue(mockTransformedData);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable
    expect(result && typeof result === 'object' && 'subscribe' in result).toBeTruthy();

    // Subscribe to get the emitted value
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emittedValue = await lastValueFrom(result as any);

    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(123);
    expect(mockOpalFinesService.getDefendantAccountParty).toHaveBeenCalledWith(123, 'DEFENDANT123');
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      mockDefendantData,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(emittedValue).toEqual(mockDefendantData);
  });

  it('should return a RedirectCommand when no valid party ID is found', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'individual';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: '',
      parent_guardian_party_id: null,
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.mockReturnValue(throwError(() => new Error('API Error')));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      throw new Error('Expected observable result');
    }
  });

  it('should return observable with transformed form data on successful API call with parent guardian party', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'parentGuardian';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: 'GUARDIAN456',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockDefendantData = {
      defendant_account_party: {
        is_debtor: false,
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTransformedData = {} as any;

    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.mockReturnValue(of(mockDefendantData));
    mockPayloadService.transformPayload.mockReturnValue(mockDefendantData);
    mockPayloadService.transformPayload.mockReturnValue(mockDefendantData);
    mockPayloadService.mapDebtorAccountPartyPayload.mockReturnValue(mockTransformedData);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable
    expect(result && typeof result === 'object' && 'subscribe' in result).toBeTruthy();

    // Subscribe to get the emitted value
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emittedValue = await lastValueFrom(result as any);

    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(123);
    expect(mockOpalFinesService.getDefendantAccountParty).toHaveBeenCalledWith(123, 'GUARDIAN456');
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      mockDefendantData,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(emittedValue).toEqual(mockDefendantData);
  });

  it('should return a RedirectCommand when no valid party ID is found', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'individual';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: '',
      parent_guardian_party_id: null,
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(mockHeaderData));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      throw new Error('Expected observable result');
    }
  });

  it('should return a RedirectCommand on heading data fetch error', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'individual';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(
      throwError(() => new Error('Heading API Error')),
    );

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      throw new Error('Expected observable result');
    }
  });

  it('should return a RedirectCommand when getDefendantAccountParty fails', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'individual';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: 'GUARDIAN456',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.mockReturnValue(throwError(() => new Error('Party API Error')));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      throw new Error('Expected observable result');
    }
  });

  it('should return a RedirectCommand when requested partyType has no corresponding party ID', async () => {
    const route = {
      paramMap: {
        get: vi.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return '123';
          if (key === 'partyType') return 'parentGuardian';
          return null;
        }),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: null, // No parent guardian party ID available
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.mockReturnValue(of(mockHeaderData));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand when party ID is not available
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      throw new Error('Expected observable result');
    }
  });
});
