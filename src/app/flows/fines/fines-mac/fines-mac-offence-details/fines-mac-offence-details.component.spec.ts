import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from './constants/fines-mac-offence-details-form';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacOffenceDetailsForm } from './interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from './mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from './constants/fines-mac-offence-details-state';
import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';

describe('FinesMacOffenceDetailsComponent', () => {
  let component: FinesMacOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacOffenceDetailsForm[];

  beforeEach(async () => {
    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getResultPrettyName: jasmine.createSpy('getResultPrettyName').and.returnValue(OPAL_FINES_RESULT_PRETTY_NAME_MOCK),
    };
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_OFFENCE_DETAILS_FORM;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesService, useValue: mockFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit[0].nestedFlow = false;

    component.handleOffenceDetailsSubmit(formSubmit[0]);

    expect(mockFinesService.finesMacState.offenceDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit[0].nestedFlow = true;

    component.handleOffenceDetailsSubmit(formSubmit[0]);

    expect(mockFinesService.finesMacState.offenceDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.offenceDetails], {
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

  it('should use FINES_MAC_OFFENCE_DETAILS_STATE when offenceDetails is empty', () => {
    mockFinesService.finesMacState.offenceDetails = [];

    component.ngOnInit();

    expect(component.formData).toEqual(FINES_MAC_OFFENCE_DETAILS_STATE);
  });
});
