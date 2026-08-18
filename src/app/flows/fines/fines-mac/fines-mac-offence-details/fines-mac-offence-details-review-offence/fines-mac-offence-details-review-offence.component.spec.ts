import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from '../mocks/fines-mac-offence-details-state-impositions.mock';
import { FinesMacOffenceDetailsReviewOffenceComponent } from './fines-mac-offence-details-review-offence.component';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details.service';
import { IOpalFinesOffencesRefData } from '../../../services/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-offences-ref-data-duplicate-code.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';

describe('FinesMacOffenceDetailsReviewOffenceComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let offenceDetailsService: FinesMacOffenceDetailsService;

  const activatedRouteMock = {
    parent: of('offence-details'),
    snapshot: {
      data: {
        results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
        majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
      },
    },
  };

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: vi.fn().mockReturnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
      getResultPrettyName: vi.fn().mockReturnValue(OPAL_FINES_RESULT_PRETTY_NAME_MOCK),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceComponent);
    component = fixture.componentInstance;

    offenceDetailsService = TestBed.inject(FinesMacOffenceDetailsService);

    component.offence = {
      ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
        fm_offence_details_impositions: [structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0])],
      },
    };
    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.showActions = false;
  });

  beforeEach(() => {
    activatedRouteMock.snapshot.data = {
      results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
      majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
    };
    component.offence = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.showActions = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action when onActionClick is called', () => {
    const event = { actionName: 'testAction', offenceId: 123 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.actionClicked, 'emit');

    component.emitAction(event);

    expect(emitSpy).toHaveBeenCalledWith(event);
  });

  it('should leave existing reference data unchanged when route data is missing', () => {
    const existingResults = structuredClone(OPAL_FINES_RESULTS_REF_DATA_MOCK);
    const existingMajorCreditors = structuredClone(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK);
    activatedRouteMock.snapshot.data = {} as never;
    component.impositionRefData = existingResults;
    component.majorCreditorRefData = existingMajorCreditors;

    component.ngOnInit();

    expect(component.impositionRefData).toEqual(existingResults);
    expect(component.majorCreditorRefData).toEqual(existingMajorCreditors);
  });

  describe('offenceDetails$', () => {
    it('should expose and render the exact matched offence details', async () => {
      vi.mocked(mockOpalFinesService.getOffenceByCjsCode!).mockReturnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK));
      component.offence.formData.fm_offence_details_offence_cjs_code = 'CA03010D';
      component.offence.formData.fm_offence_details_offence_id = 314683;
      fixture.detectChanges();

      const offenceDetails = await firstValueFrom(component.offenceDetails$);

      expect(offenceDetails).toEqual(
        expect.objectContaining({
          offence_id: 314683,
          offence_title: 'No Televison Licence',
        }),
      );
    });

    it('should use the first offence details when no exact match is found', async () => {
      vi.spyOn(offenceDetailsService, 'findExactOffenceMatch').mockReturnValue(undefined);
      fixture.detectChanges();
      const offenceDetails = await firstValueFrom(component.offenceDetails$);

      expect(offenceDetails).toEqual(
        expect.objectContaining({
          offence_title: 'ak test',
          offence_id: 314441,
        }),
      );
    });

    it('should use the saved offence id when duplicate code matches are returned', async () => {
      vi.mocked(mockOpalFinesService.getOffenceByCjsCode!).mockReturnValue(
        of(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK),
      );

      component.offence.formData.fm_offence_details_offence_cjs_code = 'GMMET001';
      component.offence.formData.fm_offence_details_offence_id = 41800;

      fixture.detectChanges();

      const offenceDetails = await firstValueFrom(component.offenceDetails$);

      expect(offenceDetails).toEqual(
        expect.objectContaining({
          offence_id: 41800,
          offence_title: 'Duplicate offence title B',
        }),
      );
    });

    it('should return null when no exact match is found and refData is empty', async () => {
      vi.spyOn(offenceDetailsService, 'findExactOffenceMatch').mockReturnValue(undefined);

      vi.mocked(mockOpalFinesService.getOffenceByCjsCode!).mockReturnValue(
        of({
          refData: [],
        } as unknown as IOpalFinesOffencesRefData),
      );

      fixture.detectChanges();
      const offenceDetails = await firstValueFrom(component.offenceDetails$);

      expect(offenceDetails).toBe(null);
    });

    it('should call findExactOffenceMatch with the offence code and offence id', async () => {
      const findExactOffenceMatchSpy = vi.spyOn(offenceDetailsService, 'findExactOffenceMatch');

      fixture.detectChanges();
      await firstValueFrom(component.offenceDetails$);

      expect(findExactOffenceMatchSpy).toHaveBeenCalledWith(
        OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK,
        component.offence.formData.fm_offence_details_offence_cjs_code,
        component.offence.formData.fm_offence_details_offence_id,
      );
    });
  });

  describe('getOffenceCaption', () => {
    it('should return the formatted offence title and code', () => {
      const offenceDetails = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData[0];

      vi.spyOn(offenceDetailsService, 'getFormattedTitleAndCode').mockReturnValue('No Televison Licence (CA03010D)');

      const result = component.getOffenceCaption(offenceDetails);

      expect(offenceDetailsService.getFormattedTitleAndCode).toHaveBeenCalledWith(offenceDetails);
      expect(result).toBe('No Televison Licence (CA03010D)');
    });
  });
});
