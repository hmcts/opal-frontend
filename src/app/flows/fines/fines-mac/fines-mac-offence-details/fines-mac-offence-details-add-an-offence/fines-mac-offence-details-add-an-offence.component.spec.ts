import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../constants/fines-mac-offence-details-form.constant';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../constants/fines-mac-offence-details-draft-state.constant';

describe('FinesMacOffenceDetailsAddAnOffenceComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacOffenceDetailsForm[];

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'offenceIndex',
      'addedOffenceCode',
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getResultPrettyName: jasmine.createSpy('getResultPrettyName').and.returnValue(OPAL_FINES_RESULT_PRETTY_NAME_MOCK),
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

    formSubmit = FINES_MAC_OFFENCE_DETAILS_FORM;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        { provide: OpalFines, useValue: mockOpalFinesService },
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

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component['resultCodeData$']).not.toBeUndefined();
    expect(component['majorCreditorData$']).not.toBeUndefined();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit[0].nestedFlow = false;

    component.handleOffenceDetailsSubmit(formSubmit[0]);

    expect(mockFinesService.finesMacState.offenceDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit[0].nestedFlow = true;

    component.handleOffenceDetailsSubmit(formSubmit[0]);

    expect(mockFinesService.finesMacState.offenceDetails).toEqual([formSubmit[0]]);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should update offence details index when form exists in the state', () => {
    const form = FINES_MAC_OFFENCE_DETAILS_FORM_MOCK;

    const existingForm = FINES_MAC_OFFENCE_DETAILS_FORM_MOCK;

    mockFinesService.finesMacState.offenceDetails = [existingForm];

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0]).toEqual(form);
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = FINES_MAC_OFFENCE_DETAILS_FORM_MOCK;

    mockFinesService.finesMacState.offenceDetails = [];

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0]).toEqual(form);
  });

  it('should add new object when offenceDetails is empty', () => {
    mockFinesService.finesMacState.offenceDetails = [];

    component['retrieveFormData']();

    expect(mockFinesService.finesMacState.offenceDetails).toEqual([]);
  });
});
