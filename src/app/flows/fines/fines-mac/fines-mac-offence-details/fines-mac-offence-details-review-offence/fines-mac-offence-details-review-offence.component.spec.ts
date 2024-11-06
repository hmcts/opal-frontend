import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceComponent } from './fines-mac-offence-details-review-offence.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../fines-mac-offence-details-review/mocks/fines-mac-offence-details-review-summary-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from '../mocks/fines-mac-offence-details-state.mock';

describe('FinesMacOffenceDetailsReviewOffenceComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceComponent>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
      'removeIndexFromImpositionKeys',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesMacOffenceDetailsService.removeIndexFromImpositionKeys.and.returnValue({
      ...FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK,
    });

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceComponent],
      providers: [
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceComponent);
    component = fixture.componentInstance;

    component.offence = {
      ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK,
      formData: {
        ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData,
        fm_offence_details_impositions: [{ ...FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0] }],
      },
    };
    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.showActions = false;

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.offence = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };
    component.impositionRefData = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    component.majorCreditorRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    component.showActions = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit action when onActionClick is called', () => {
    const event = { actionName: 'testAction', offenceId: 123 };
    const emitSpy = spyOn(component.actionClicked, 'emit');

    component.emitAction(event);

    expect(emitSpy).toHaveBeenCalledWith(event);
  });
});
