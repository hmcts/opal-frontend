import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '../../../../services/opal-fines-service/opal-fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { Observable, of, throwError } from 'rxjs';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offence-data-non-snake-case.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { fetchMapFinesMacPayloadResolver } from './fetch-map-fines-mac-payload.resolver';
import { IFetchMapFinesMacPayload } from './interfaces/fetch-map-fines-mac-payload.interface';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from '../../../services/fines-mac-payload/mocks/fines-mac-payload-fines-mac-state.mock';
import { FinesMacPayloadService } from '../../../services/fines-mac-payload/fines-mac-payload.service';

describe('fetchMapFinesMacPayloadResolver', () => {
  const executeResolver: ResolveFn<IFetchMapFinesMacPayload> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchMapFinesMacPayloadResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStateService: jasmine.SpyObj<GlobalStateService>;

  const DRAFT_ACCOUNT_ID = 1;

  beforeEach(() => {
    // Mock services
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', [
      'getDraftAccountById',
      'getBusinessUnitById',
      'getOffenceById',
    ]);
    mockFinesMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['mapAccountPayload']);
    mockGlobalStateService = jasmine.createSpyObj('GlobalStateService', ['error'], {
      error: { set: jasmine.createSpy('set') },
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: GlobalStateService, useValue: mockGlobalStateService },
      ],
    });
  });

  it('should resolve data when all API calls succeed', async () => {
    // Mock successful API calls
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT)));
    mockOpalFinesService.getBusinessUnitById.and.returnValue(
      of(structuredClone(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK)),
    );
    mockOpalFinesService.getOffenceById.and.returnValue(
      of(structuredClone(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK)),
    );
    mockFinesMacPayloadService.mapAccountPayload.and.returnValue(structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    const result = await executeResolver(route, mockRouterStateSnapshot);

    expect(result).toEqual({
      finesMacState: FINES_MAC_PAYLOAD_FINES_MAC_STATE,
      finesMacDraft: FINES_MAC_PAYLOAD_ADD_ACCOUNT,
    });

    // Verify calls were made with the correct arguments
    expect(mockOpalFinesService.getDraftAccountById).toHaveBeenCalledWith(DRAFT_ACCOUNT_ID);
    expect(mockOpalFinesService.getBusinessUnitById).toHaveBeenCalledWith(61);
  });

  // it('should resolve data when all API calls succeed - empty offences', async () => {
  //   // Mock successful API calls
  //   const draftAccountWithEmptyOffences = {
  //     ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
  //     account: { ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT).account, offences: null },
  //   };
  //   mockOpalFinesService.getDraftAccountById.and.returnValue(of(draftAccountWithEmptyOffences));
  //   mockOpalFinesService.getBusinessUnitById.and.returnValue(
  //     of(structuredClone(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK)),
  //   );

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
  //   const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

  //   const result = await executeResolver(route, mockRouterStateSnapshot);

  //   expect(result).toEqual({
  //     finesMacState: FINES_MAC_PAYLOAD_FINES_MAC_STATE,
  //     finesMacDraft: FINES_MAC_PAYLOAD_ADD_ACCOUNT,
  //   });

  //   // Verify calls were made with the correct arguments
  //   expect(mockOpalFinesService.getDraftAccountById).toHaveBeenCalledWith(DRAFT_ACCOUNT_ID);
  //   expect(mockOpalFinesService.getBusinessUnitById).toHaveBeenCalledWith(61);
  //   expect(mockOpalFinesService.getOffenceById).not.toHaveBeenCalled();
  // });

  it('should throw an error and update global state if business unit ID is missing', async () => {
    // Mock draft account with no business unit ID
    const draftAccountWithoutBusinessUnitId = {
      ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
      business_unit_id: null,
    };
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(draftAccountWithoutBusinessUnitId));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWithError(
      `Business unit ID is missing for draftAccountId: ${DRAFT_ACCOUNT_ID}`,
    );

    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: `Business unit ID is missing for draftAccountId: ${DRAFT_ACCOUNT_ID}`,
    });
  });

  it('should throw an error and update global state if business unit is not found', async () => {
    // Mock API responses
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT)));
    mockOpalFinesService.getBusinessUnitById.and.returnValue(
      of(null) as unknown as Observable<IOpalFinesBusinessUnitNonSnakeCase>,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWithError(
      'Cannot find business unit for ID: 61',
    );

    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: 'Cannot find business unit for ID: 61',
    });
  });

  it('should handle unexpected errors and update global state', async () => {
    // Mock API response with an unexpected error
    mockOpalFinesService.getDraftAccountById.and.returnValue(throwError(() => new Error('Unexpected error')));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWithError('Unexpected error');

    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: 'Unexpected error',
    });
  });

  it('should handle unexpected errors with a default error message', async () => {
    // Mock API response with an unexpected error that does not have a message
    mockOpalFinesService.getDraftAccountById.and.returnValue(
      throwError(() => ({ name: 'ErrorWithoutMessage' }) as Error),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWith({
      name: 'ErrorWithoutMessage',
    });

    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: 'An unexpected error occurred',
    });
  });
});
