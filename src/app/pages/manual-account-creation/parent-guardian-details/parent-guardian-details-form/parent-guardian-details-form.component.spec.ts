import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentGuardianDetailsFormComponent } from './parent-guardian-details-form.component';
import { MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from '@mocks';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';

describe('ParentGuardianDetailsFormComponent', () => {
  let component: ParentGuardianDetailsFormComponent;
  let fixture: ComponentFixture<ParentGuardianDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentGuardianDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentGuardianDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    component.macStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    component.macStateService.manualAccountCreation.accountDetails.defendantType = 'parentOrGuardianToPay';
    const parentGuardianForm = MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FORM_MOCK;
    parentGuardianForm.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](parentGuardianForm.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(parentGuardianForm);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    component.macStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    component.macStateService.manualAccountCreation.accountDetails.defendantType = 'parentOrGuardianToPay';
    const parentGuardianForm = MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FORM_MOCK;
    parentGuardianForm.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](parentGuardianForm.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(parentGuardianForm);
  });
});
