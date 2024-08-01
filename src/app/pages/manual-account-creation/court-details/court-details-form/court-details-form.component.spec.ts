import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDetailsFormComponent } from './court-details-form.component';
import {
  COURT_AUTOCOMPLETE_ITEMS_MOCK,
  LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK,
  MANUAL_ACCOUNT_CREATION_COURT_DETAILS_FORM_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
} from '@mocks';
import { MacStateService } from '@services';

describe('CourtDetailsFormComponent', () => {
  let component: CourtDetailsFormComponent;
  let fixture: ComponentFixture<CourtDetailsFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [CourtDetailsFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';
    component.sendingCourtAutoCompleteItems = LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK;
    component.enforcingCourtAutoCompleteItems = COURT_AUTOCOMPLETE_ITEMS_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    component.defendantType = 'adultOrYouthOnly';
    const courtDetailsForm = MANUAL_ACCOUNT_CREATION_COURT_DETAILS_FORM_MOCK;
    courtDetailsForm.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](courtDetailsForm.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(courtDetailsForm);
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    component.defendantType = 'adultOrYouthOnly';
    const courtDetailsForm = MANUAL_ACCOUNT_CREATION_COURT_DETAILS_FORM_MOCK;
    courtDetailsForm.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](courtDetailsForm.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(courtDetailsForm);
  });
});
