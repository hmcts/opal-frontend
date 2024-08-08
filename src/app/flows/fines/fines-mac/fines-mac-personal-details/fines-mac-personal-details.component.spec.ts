import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPersonalDetailsComponent } from './fines-mac-personal-details.component';
import { IFinesMacPersonalDetailsForm, IFinesMacPersonalDetailsState } from '@interfaces/fines/mac';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesService } from '@services/fines';
import {
  FINES_MAC_PERSONAL_DETAILS_FORM_MOCK,
  FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
  FINES_MAC_STATE_MOCK,
} from '@mocks/fines/mac';

describe('FinesMacPersonalDetailsComponent', () => {
  let component: FinesMacPersonalDetailsComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formData: IFinesMacPersonalDetailsState;
  let formSubmit: IFinesMacPersonalDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    formData = FINES_MAC_PERSONAL_DETAILS_STATE_MOCK;
    formSubmit = FINES_MAC_PERSONAL_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPersonalDetailsComponent);
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

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.personalDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacAccountDetails]);
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.personalDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacContactDetails]);
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
