import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacEmployerDetailsComponent } from './fines-mac-employer-details.component';
import { FinesService } from '../../services/fines.service';
import { IFinesMacEmployerDetailsForm, IFinesMacEmployerDetailsState } from '../interfaces';
import {
  FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK,
  FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
  FINES_MAC_STATE_MOCK,
} from '../mocks';
import { FinesMacRoutes } from '../enums';

describe('FinesMacEmployerDetailsComponent', () => {
  let component: FinesMacEmployerDetailsComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formData: IFinesMacEmployerDetailsState;
  let formSubmit: IFinesMacEmployerDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formData = FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK;
    formSubmit = FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacEmployerDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacAccountDetails]);
  });

  it('should handle form submission and navigate to offence details - adult or youth only', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    formSubmit.nestedFlow = true;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacOffenceDetails]);
  });

  it('should handle form submission and navigate to personal details - parent or guardian to pay', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = 'parentOrGuardianToPay';
    formSubmit.nestedFlow = true;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.employerDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacPersonalDetails]);
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
