import { TestBed } from '@angular/core/testing';
import { RedirectCommand, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { defendantAccountPartyResolver } from './defendant-account-party.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../constants/fines-acc-defendant-routing-paths.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';

describe('defendantAccountPartyResolver', () => {
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', [
      'getDefendantAccountParty',
      'getDefendantAccountHeadingData',
    ]);
    mockPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['mapDebtorAccountPartyPayload']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

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
        get: jasmine.createSpy('get').and.returnValue(null),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
  });

  it('should return observable with transformed form data on successful API call with defendant party', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: null,
      debtor_type: 'Defendant',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockDefendantData = {} as any;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTransformedData = {} as any;

    mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.and.returnValue(of(mockDefendantData));
    mockPayloadService.mapDebtorAccountPartyPayload.and.returnValue(mockTransformedData);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable
    expect(result && typeof result === 'object' && 'subscribe' in result).toBeTruthy();

    // Subscribe to get the emitted value
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emittedValue = await lastValueFrom(result as any);

    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(123);
    expect(mockOpalFinesService.getDefendantAccountParty).toHaveBeenCalledWith(123, 'DEFENDANT123');
    expect(mockPayloadService.mapDebtorAccountPartyPayload).toHaveBeenCalledWith(mockDefendantData);
    expect(emittedValue).toEqual({
      formData: mockTransformedData,
      nestedFlow: false,
    });
  });

  it('should return a RedirectCommand on API error', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: null,
      debtor_type: 'Defendant',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.and.returnValue(throwError(() => new Error('API Error')));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      fail('Expected observable result');
    }
  });

  it('should return observable with transformed form data on successful API call with parent guardian party', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: 'DEFENDANT123',
      parent_guardian_party_id: 'GUARDIAN456',
      debtor_type: 'Parent/Guardian',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockDefendantData = {} as any;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTransformedData = {} as any;

    mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(of(mockHeaderData));
    mockOpalFinesService.getDefendantAccountParty.and.returnValue(of(mockDefendantData));
    mockPayloadService.mapDebtorAccountPartyPayload.and.returnValue(mockTransformedData);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable
    expect(result && typeof result === 'object' && 'subscribe' in result).toBeTruthy();

    // Subscribe to get the emitted value
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emittedValue = await lastValueFrom(result as any);

    expect(mockOpalFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(123);
    expect(mockOpalFinesService.getDefendantAccountParty).toHaveBeenCalledWith(123, 'GUARDIAN456');
    expect(mockPayloadService.mapDebtorAccountPartyPayload).toHaveBeenCalledWith(mockDefendantData);
    expect(emittedValue).toEqual({
      formData: mockTransformedData,
      nestedFlow: false,
    });
  });

  it('should return a RedirectCommand when no valid party ID is found', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockHeaderData: IOpalFinesAccountDefendantDetailsHeader = {
      defendant_account_party_id: '',
      parent_guardian_party_id: null,
      debtor_type: 'Defendant',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(of(mockHeaderData));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountPartyResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      fail('Expected observable result');
    }
  });

  it('should return a RedirectCommand on heading data fetch error', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);
    mockOpalFinesService.getDefendantAccountHeadingData.and.returnValue(
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
      fail('Expected observable result');
    }
  });
});
