import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of, firstValueFrom, Observable } from 'rxjs';
import { defendantAccountAtAGlanceResolver } from './defendant-account-at-a-glance.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { IFinesAccAddCommentsFormState } from '../../fines-acc-comments-add/interfaces/fines-acc-comments-add-form-state.interface';

describe('defendantAccountAtAGlanceResolver', () => {
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockPayloadService: jasmine.SpyObj<InstanceType<typeof FinesAccPayloadService>>;

  beforeEach(() => {
    const opalFinesServiceSpy = jasmine.createSpyObj('OpalFines', ['getDefendantAccountAtAGlance']);
    const payloadServiceSpy = jasmine.createSpyObj('FinesAccPayloadService', ['transformAtAGlanceDataToCommentsForm']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: opalFinesServiceSpy },
        { provide: FinesAccPayloadService, useValue: payloadServiceSpy },
      ],
    });

    mockOpalFinesService = TestBed.inject(OpalFines) as jasmine.SpyObj<OpalFines>;
    mockPayloadService = TestBed.inject(FinesAccPayloadService) as jasmine.SpyObj<
      InstanceType<typeof FinesAccPayloadService>
    >;
  });

  it('should resolve comments form data successfully', async () => {
    const accountId = '77';

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

    mockOpalFinesService.getDefendantAccountAtAGlance.and.returnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK),
    );
    mockPayloadService.transformAtAGlanceDataToCommentsForm.and.returnValue(expectedFormData);

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(defendantAccountAtAGlanceResolver(route, state) as Observable<IFinesAccAddCommentsFormState>),
    );

    expect(result).toEqual(expectedFormData);
    expect(mockOpalFinesService.getDefendantAccountAtAGlance).toHaveBeenCalledWith(77);
    expect(mockPayloadService.transformAtAGlanceDataToCommentsForm).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
    );
  });
});
