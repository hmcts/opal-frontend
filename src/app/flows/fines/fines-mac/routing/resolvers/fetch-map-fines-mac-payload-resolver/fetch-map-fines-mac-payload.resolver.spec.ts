import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '../../../../services/opal-fines-service/opal-fines.service';
import { Observable, of, throwError } from 'rxjs';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offence-data-non-snake-case.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { fetchMapFinesMacPayloadResolver } from './fetch-map-fines-mac-payload.resolver';
import { IFetchMapFinesMacPayload } from './interfaces/fetch-map-fines-mac-payload.interface';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from '../../../services/fines-mac-payload/mocks/fines-mac-payload-fines-mac-state.mock';
import { FinesMacPayloadService } from '../../../services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constant';

describe('fetchMapFinesMacPayloadResolver', () => {
  const executeResolver: ResolveFn<IFetchMapFinesMacPayload> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchMapFinesMacPayloadResolver(...resolverParameters));

  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let globalStore: GlobalStoreType;

  const DRAFT_ACCOUNT_ID = 1;

  beforeEach(() => {
    // Mock services
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', [
      'getDraftAccountById',
      'getBusinessUnitById',
      'getOffenceById',
      'getCourts',
      'getMajorCreditors',
      'getLocalJusticeAreas',
      'getResults',
      'getProsecutors',
    ]);
    mockFinesMacPayloadService = jasmine.createSpyObj('FinesMacPayloadService', ['mapAccountPayload']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
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
    mockOpalFinesService.getCourts.and.returnValue(of(OPAL_FINES_COURT_REF_DATA_MOCK));
    mockOpalFinesService.getMajorCreditors.and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK));
    mockOpalFinesService.getLocalJusticeAreas.and.returnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK));
    mockOpalFinesService.getResults.and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK));
    mockOpalFinesService.getProsecutors.and.returnValue(of(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK));
    mockFinesMacPayloadService.mapAccountPayload.and.returnValue(structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    const result = await executeResolver(route, mockRouterStateSnapshot);

    expect(result).toEqual({
      finesMacState: FINES_MAC_PAYLOAD_FINES_MAC_STATE,
      finesMacDraft: FINES_MAC_PAYLOAD_ADD_ACCOUNT,
      courts: OPAL_FINES_COURT_REF_DATA_MOCK,
      majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
      localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
      results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
      prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
    });

    // Verify calls were made with the correct arguments
    expect(mockOpalFinesService.getDraftAccountById).toHaveBeenCalledWith(DRAFT_ACCOUNT_ID);
    expect(mockOpalFinesService.getBusinessUnitById).toHaveBeenCalledWith(61);
    expect(mockOpalFinesService.getCourts).toHaveBeenCalledWith(61);
    expect(mockOpalFinesService.getMajorCreditors).toHaveBeenCalledWith(61);
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalled();
    expect(mockOpalFinesService.getResults).toHaveBeenCalled();
  });

  it('should resolve data when all API calls succeed - empty offences', async () => {
    // Mock successful API calls
    const draftAccountWithEmptyOffences = {
      ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
      account: { ...structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT).account, offences: null },
    };
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(draftAccountWithEmptyOffences));
    mockOpalFinesService.getBusinessUnitById.and.returnValue(
      of(structuredClone(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK)),
    );
    mockOpalFinesService.getCourts.and.returnValue(of(OPAL_FINES_COURT_REF_DATA_MOCK));
    mockOpalFinesService.getMajorCreditors.and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK));
    mockOpalFinesService.getLocalJusticeAreas.and.returnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK));
    mockOpalFinesService.getResults.and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK));
    mockOpalFinesService.getProsecutors.and.returnValue(of(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK));

    const mapPayloadResult = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    mapPayloadResult.offenceDetails = [];

    mockFinesMacPayloadService.mapAccountPayload.and.returnValue(mapPayloadResult);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => DRAFT_ACCOUNT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    const result = await executeResolver(route, mockRouterStateSnapshot);

    expect(result).toEqual({
      finesMacState: mapPayloadResult,
      finesMacDraft: draftAccountWithEmptyOffences,
      courts: OPAL_FINES_COURT_REF_DATA_MOCK,
      majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
      localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
      results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
      prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
    });

    // Verify calls were made with the correct arguments
    expect(mockOpalFinesService.getDraftAccountById).toHaveBeenCalledWith(DRAFT_ACCOUNT_ID);
    expect(mockOpalFinesService.getBusinessUnitById).toHaveBeenCalledWith(61);
    expect(mockOpalFinesService.getCourts).toHaveBeenCalled();
    expect(mockOpalFinesService.getMajorCreditors).toHaveBeenCalled();
    expect(mockOpalFinesService.getLocalJusticeAreas).toHaveBeenCalled();
    expect(mockOpalFinesService.getResults).toHaveBeenCalled();
    expect(mockOpalFinesService.getOffenceById).not.toHaveBeenCalled();
  });

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

    expect(globalStore.error()).toEqual({
      ...GLOBAL_ERROR_STATE,
      error: true,
      title: 'There was a problem',
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

    expect(globalStore.error()).toEqual({
      ...GLOBAL_ERROR_STATE,
      error: true,
      title: 'There was a problem',
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

    expect(globalStore.error()).toEqual({
      ...GLOBAL_ERROR_STATE,
      error: true,
      message: 'Unexpected error',
      title: 'There was a problem',
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

    expect(globalStore.error()).toEqual({
      ...GLOBAL_ERROR_STATE,
      error: true,
      message: 'An unexpected error occurred',
      title: 'There was a problem',
    });
  });
});
