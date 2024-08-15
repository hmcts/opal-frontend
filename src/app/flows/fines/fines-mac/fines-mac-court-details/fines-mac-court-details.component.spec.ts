import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCourtDetailsComponent } from './fines-mac-court-details.component';
import { IFinesMacCourtDetailsForm, IFinesMacCourtDetailsState } from './interfaces';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FinesService, OpalFines } from '@services/fines';
import { FINES_MAC_STATE_MOCK } from '../mocks';
import {
  OPAL_FINES_COURT_REF_DATA_MOCK,
  OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
} from '../../services/opal-fines-service/mocks';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK, FINES_MAC_COURT_DETAILS_STATE_MOCK } from './mocks';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';

describe('FinesMacCourtDetailsComponent', () => {
  let component: FinesMacCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formData: IFinesMacCourtDetailsState;
  let formSubmit: IFinesMacCourtDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    mockOpalFinesService = {
      getLocalJusticeAreas: jasmine
        .createSpy('getLocalJusticeAreas')
        .and.returnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK)),
      getCourts: jasmine.createSpy('getCourts').and.returnValue(of(OPAL_FINES_COURT_REF_DATA_MOCK)),
    };
    formData = FINES_MAC_COURT_DETAILS_STATE_MOCK;
    formSubmit = FINES_MAC_COURT_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCourtDetailsComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
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

    fixture = TestBed.createComponent(FinesMacCourtDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component['sendingCourtData$']).not.toBeUndefined();
    expect(component['enforcementCourtData$']).not.toBeUndefined();
    expect(component['groupLjaAndCourtData$']).not.toBeUndefined();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleCourtDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.courtDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to personal details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleCourtDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.courtDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.personalDetails], {
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
});