import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent } from './fines-mac-offence-details-remove-offence-and-impositions.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../fines-mac-offence-details-review/mocks/fines-mac-offence-details-review-summary-form.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';

describe('FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent', () => {
  let component: FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getMajorCreditors: jasmine
        .createSpy('getMajorCreditors')
        .and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK)),
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
    };

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
    mockFinesMacOffenceDetailsService.offenceIndex = 0;

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    mockFinesService.finesMacState.offenceDetails = [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK }];

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent],

      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        { provide: FinesService, useValue: mockFinesService },
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

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate resultCodeData$', () => {
    expect(component.referenceData$).not.toBeUndefined();
  });

  it('should remove the offence and set offenceRemoved to true', () => {
    component.confirmOffenceRemoval();
    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(0);
    expect(mockFinesMacOffenceDetailsService.offenceRemoved).toBeTrue();
  });

  it('should navigate to reviewOffences route after removing offence', () => {
    spyOn(component, 'handleRoute');
    component.confirmOffenceRemoval();
    expect(component.handleRoute).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences);
  });

  it('should remove first item in array leaving one item remaining', () => {
    mockFinesService.finesMacState.offenceDetails = [
      { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK },
      {
        ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK,
        formData: { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData, fm_offence_details_id: 1 },
      },
    ];
    component.confirmOffenceRemoval();
    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
  });
});
