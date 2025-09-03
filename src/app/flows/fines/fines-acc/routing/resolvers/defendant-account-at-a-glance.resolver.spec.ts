import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of, firstValueFrom, Observable } from 'rxjs';
import { defendantAccountAtAGlanceResolver } from './defendant-account-at-a-glance.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-at-a-glance-tab-ref-data.mock';
import { IFinesAccAddCommentsFormState } from '../../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';

describe('defendantAccountAtAGlanceResolver', () => {
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockAccountStore: jasmine.SpyObj<InstanceType<typeof FinesAccountStore>>;
  let mockPayloadService: jasmine.SpyObj<InstanceType<typeof FinesAccPayloadService>>;

  beforeEach(() => {
    const opalFinesServiceSpy = jasmine.createSpyObj('OpalFines', ['getDefendantAccountAtAGlanceTabData']);
    const accountStoreSpy = jasmine.createSpyObj('FinesAccountStore', ['getAccountState']);
    const payloadServiceSpy = jasmine.createSpyObj('FinesAccPayloadService', ['transformAtAGlanceDataToCommentsForm']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: opalFinesServiceSpy },
        { provide: FinesAccountStore, useValue: accountStoreSpy },
        { provide: FinesAccPayloadService, useValue: payloadServiceSpy },
      ],
    });

    mockOpalFinesService = TestBed.inject(OpalFines) as jasmine.SpyObj<OpalFines>;
    mockAccountStore = TestBed.inject(FinesAccountStore) as jasmine.SpyObj<InstanceType<typeof FinesAccountStore>>;
    mockPayloadService = TestBed.inject(FinesAccPayloadService) as jasmine.SpyObj<
      InstanceType<typeof FinesAccPayloadService>
    >;
  });

  it('should resolve comments form data successfully', async () => {
    const accountId = '123';
    const mockAccountState = {
      party_id: '456',
      business_unit_user_id: 'BU123',
      business_unit_id: 'BU456',
      account_number: 'ACC123',
      party_type: 'Individual',
      party_name: 'John Doe',
      base_version: 1,
    };

    const expectedFormData: IFinesAccAddCommentsFormState = {
      facc_add_comment: 'Highly vulnerable person',
      facc_add_free_text_1: null,
      facc_add_free_text_2: 'They require welsh and english documents',
      facc_add_free_text_3: null,
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const state = {} as any;

    mockAccountStore.getAccountState.and.returnValue(mockAccountState);
    mockOpalFinesService.getDefendantAccountAtAGlanceTabData.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK),
    );
    mockPayloadService.transformAtAGlanceDataToCommentsForm.and.returnValue(expectedFormData);

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(defendantAccountAtAGlanceResolver(route, state) as Observable<IFinesAccAddCommentsFormState>),
    );

    expect(result).toEqual(expectedFormData);
    expect(mockAccountStore.getAccountState).toHaveBeenCalled();
    expect(mockOpalFinesService.getDefendantAccountAtAGlanceTabData).toHaveBeenCalledWith('BU123', 'BU456', '456');
    expect(mockPayloadService.transformAtAGlanceDataToCommentsForm).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK,
    );
  });

  it('should throw error when account ID is missing', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({}) } as any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const state = {} as any;

    expect(() => {
      TestBed.runInInjectionContext(() => defendantAccountAtAGlanceResolver(route, state));
    }).toThrowError('Account ID is required');
  });

  it('should throw error when party_id is missing', () => {
    const accountId = 123;
    const mockAccountState = {
      party_id: null,
      business_unit_user_id: 'BU123',
      business_unit_id: 'BU456',
      account_number: 'ACC123',
      party_type: 'Individual',
      party_name: 'John Doe',
      base_version: 1,
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const state = {} as any;

    mockAccountStore.getAccountState.and.returnValue(mockAccountState);

    expect(() => {
      TestBed.runInInjectionContext(() => defendantAccountAtAGlanceResolver(route, state));
    }).toThrowError('Account state is not properly initialized');
  });

  it('should throw error when business_unit_user_id is missing', () => {
    const accountId = 123;
    const mockAccountState = {
      party_id: '456',
      business_unit_user_id: null,
      business_unit_id: 'BU456',
      account_number: 'ACC123',
      party_type: 'Individual',
      party_name: 'John Doe',
      base_version: 1,
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const state = {} as any;

    mockAccountStore.getAccountState.and.returnValue(mockAccountState);

    expect(() => {
      TestBed.runInInjectionContext(() => defendantAccountAtAGlanceResolver(route, state));
    }).toThrowError('Account state is not properly initialized');
  });
});
