import { TestBed } from '@angular/core/testing';
import { RedirectCommand, ResolveFn } from '@angular/router';
import { draftAccountResolver } from './draft-account.resolver';
import { OpalFines } from '../opal-fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from '../../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-fines-mac-state.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '../mocks/opal-fines-offence-data-non-snake-case.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '../mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMacState } from '../../../fines-mac/interfaces/fines-mac-state.interface';
import { Observable, of, throwError } from 'rxjs';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '../mocks/opal-fines-business-unit-non-snake-case.mock';
import { IOpalFinesBusinessUnitNonSnakeCase } from '../interfaces/opal-fines-business-unit-ref-data.interface';

describe('draftAccountResolver', () => {
  const executeResolver: ResolveFn<IFinesMacState | RedirectCommand | null> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => draftAccountResolver(...resolverParameters));
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStateService: jasmine.SpyObj<GlobalStateService>;

  const DRAFT_ACCOUNT_ID = 1;

  beforeEach(() => {
    // Mock Services
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', [
      'getDraftAccountById',
      'getBusinessUnitById',
      'getOffenceById',
    ]);
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesDraftState', 'finesMacState']);
    mockFinesMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['mapAccountPayload']);
    mockGlobalStateService = jasmine.createSpyObj('GlobalStateService', ['error'], {
      error: { set: jasmine.createSpy('set') },
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: GlobalStateService, useValue: mockGlobalStateService },
      ],
    });
  });

  it('should resolve finesMacState when all data fetches are successful', async () => {
    mockOpalFinesService.getDraftAccountById.and.returnValue(
      of({ ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT), draft_account_id: 1 }),
    );
    mockFinesMacPayloadService.mapAccountPayload.and.returnValue(structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE));
    mockOpalFinesService.getBusinessUnitById.and.returnValue(
      of(structuredClone(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK)),
    );
    mockOpalFinesService.getOffenceById.and.returnValue(
      of(structuredClone(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK)),
    );
    mockFinesService.finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    mockFinesService.finesDraftState = structuredClone({
      ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
      draft_account_id: 1,
    });

    const expectedResult = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    expectedResult.businessUnit = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    expectedResult.offenceDetails.forEach((offence) => {
      offence.formData.fm_offence_details_offence_cjs_code = OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK.cjsCode;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    const result = await executeResolver(route, mockRouterStateSnapshot);

    expect(result).toEqual(expectedResult);
  });

  it('should throw an error and set global state when no business unit is returned', async () => {
    // Mock draft account and map payload
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT)));
    mockFinesMacPayloadService.mapAccountPayload.and.returnValue(structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE));

    // Mock business unit fetch with a null response
    mockOpalFinesService.getBusinessUnitById.and.returnValue(
      of(null) as unknown as Observable<IOpalFinesBusinessUnitNonSnakeCase>,
    );

    // Mock offences data to avoid errors
    mockOpalFinesService.getOffenceById.and.returnValue(
      of(structuredClone(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK)),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    // Execute the resolver and expect an error
    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWithError(
      'Cannot find business unit',
    );

    // Verify that global state is updated with the error
    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: 'Cannot find business unit',
    });
  });

  it('should handle unexpected errors in the resolver and set global state', async () => {
    // Mock draft account fetch to throw an unexpected error
    mockOpalFinesService.getDraftAccountById.and.returnValue(throwError(() => new Error('Unexpected error')));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    // Execute the resolver and expect the error to be rethrown
    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWithError('Unexpected error');

    // Verify that global state is updated with the error
    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: 'Unexpected error',
    });
  });

  it('should set a default error message when the error has no message', async () => {
    // Mock draft account fetch to throw an error without a message
    mockOpalFinesService.getDraftAccountById.and.returnValue(
      throwError(() => ({ name: 'ErrorWithoutMessage' }) as Error),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    // Execute the resolver and expect it to throw the original error object
    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWith({
      name: 'ErrorWithoutMessage',
    });

    // Verify that the global state is updated with the default error message
    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: true,
      message: 'An error occurred while processing the draft account resolver',
    });
  });
});
