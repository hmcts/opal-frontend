import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewComponent } from './fines-mac-offence-details-review.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@services/date-service/date.service';
import { of } from 'rxjs';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from './mocks/fines-mac-offence-details-review-summary-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from '../mocks/fines-mac-offence-details-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../constants/fines-mac-offence-details-form.constant';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_SERVICE_FORM } from './mocks/fines-mac-offence-details-review-summary-service-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';

describe('FinesMacOffenceDetailsReviewComponent', () => {
  let component: FinesMacOffenceDetailsReviewComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService> | null;
  let mockOpalFinesService: Partial<OpalFines> | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;

  beforeEach(async () => {
    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getMajorCreditors: jasmine
        .createSpy('getMajorCreditors')
        .and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK)),
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
    };

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    mockFinesService!.finesMacState.offenceDetails = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM)];
    mockFinesService!.finesMacState.offenceDetails[0].formData.fm_offence_details_impositions = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[0]),
    ];

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'addedOffenceCode',
      'emptyOffences',
      'removeIndexFromImpositionKeys',
      'offenceCodeMessage',
    ]);
    mockFinesMacOffenceDetailsService!.removeIndexFromImpositionKeys.and.returnValue([
      ...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK),
    ]);

    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormat']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: FinesService, useValue: mockFinesService },
        {
          provide: FinesMacOffenceDetailsService,
          useValue: mockFinesMacOffenceDetailsService,
        },
        { provide: DateService, mockDateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    mockFinesMacOffenceDetailsService = null;
    mockOpalFinesService = null;
    mockDateService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set offencesImpositions and sort offences by date', () => {
    if (!component || !mockFinesService || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails = [
      ...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_SERVICE_FORM),
    ];

    component['getOffencesImpositions']();

    expect(component.offencesImpositions).toEqual(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK);
    expect(mockFinesMacOffenceDetailsService.emptyOffences).toBe(false);
  });

  it('should set emptyOffences to true when offencesImpositions is empty', () => {
    if (!component || !mockFinesService || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.offenceDetails = [];
    mockFinesMacOffenceDetailsService.removeIndexFromImpositionKeys.and.returnValue([]);

    component['getOffencesImpositions']();

    expect(component.offencesImpositions).toEqual([]);
    expect(mockFinesMacOffenceDetailsService.emptyOffences).toBe(true);
  });

  it('should sort offences by date in ascending order', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.offencesImpositions = [...FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK];

    component['sortOffencesByDate']();

    expect(component.offencesImpositions).toEqual(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK);
  });

  it('should reset addedOffenceCode and offenceDetailsDraft on ngOnDestroy', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };

    component.ngOnDestroy();

    expect(mockFinesMacOffenceDetailsService.addedOffenceCode).toEqual('');
    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft).toEqual([]);
    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition).toBeNull();
  });
});
