import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDetailsComponent } from './court-details.component';
import { CourtService, LocalJusticeAreaService, MacStateService } from '@services';
import { of } from 'rxjs';
import { COURT_REF_DATA_MOCK, LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@mocks';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
} from '@constants';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { IManualAccountCreationCourtDetailsForm, IManualAccountCreationCourtDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';

describe('CourtDetailsComponent', () => {
  let component: CourtDetailsComponent;
  let fixture: ComponentFixture<CourtDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;
  let localJusticeAreaService: Partial<LocalJusticeAreaService>;
  let courtService: Partial<CourtService>;

  beforeEach(async () => {
    localJusticeAreaService = {
      getLocalJusticeAreas: jasmine
        .createSpy('getLocalJusticeAreas')
        .and.returnValue(of(LOCAL_JUSTICE_AREA_REF_DATA_MOCK)),
    };
    courtService = {
      getCourts: jasmine.createSpy('getCourts').and.returnValue(of(COURT_REF_DATA_MOCK)),
    };
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      courtDetails: MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
      businessUnit: MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [CourtDetailsComponent],
      providers: [
        { provide: MacStateService, useValue: mockMacStateService },
        { provide: LocalJusticeAreaService, useValue: localJusticeAreaService },
        { provide: CourtService, useValue: courtService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component.sendingCourtData$).not.toBeUndefined();
    expect(component.enforcementCourtData$).not.toBeUndefined();
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const formData: IManualAccountCreationCourtDetailsState = {
      sendingCourt: 'Test',
      pcr: 'Test',
      enforcementCourt: 'Test',
    };
    const courtDetailsFormSubmit: IManualAccountCreationCourtDetailsForm = {
      formData: formData,
      nestedFlow: false,
    };

    component.handleCourtDetailsSubmit(courtDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.courtDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = 'adultOrYouthOnly';
    const formData: IManualAccountCreationCourtDetailsState = {
      sendingCourt: 'Test',
      pcr: 'Test',
      enforcementCourt: 'Test',
    };
    const courtDetailsFormSubmit: IManualAccountCreationCourtDetailsForm = {
      formData: formData,
      nestedFlow: true,
    };

    component.handleCourtDetailsSubmit(courtDetailsFormSubmit);

    expect(mockMacStateService.manualAccountCreation.courtDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.personalDetails]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component.macStateService.manualAccountCreation.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component.macStateService.manualAccountCreation.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
