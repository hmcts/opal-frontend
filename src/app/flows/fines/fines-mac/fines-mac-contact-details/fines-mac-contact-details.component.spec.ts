import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacContactDetailsComponent } from './fines-mac-contact-details.component';
import { IFinesMacContactDetailsForm, IFinesMacContactDetailsState } from './interfaces';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesService } from '@services/fines';
import {
  FINES_MAC_STATE_MOCK,
} from '@mocks/fines/mac';
import { FINES_MAC_CONTACT_DETAILS_FORM_MOCK, FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from './mocks';

describe('FinesMacContactDetailsComponent', () => {
  let component: FinesMacContactDetailsComponent;
  let fixture: ComponentFixture<FinesMacContactDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacContactDetailsForm;
  let formData: IFinesMacContactDetailsState;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_CONTACT_DETAILS_FORM_MOCK;
    formData = FINES_MAC_CONTACT_DETAILS_STATE_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacContactDetailsComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacContactDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleContactDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.contactDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacAccountDetails]);
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleContactDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.contactDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacEmployerDetails]);
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
