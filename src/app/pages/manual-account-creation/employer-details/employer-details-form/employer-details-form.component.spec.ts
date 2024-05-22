import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDetailsFormComponent } from './employer-details-form.component';
import {
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE_MOCK,
} from '@mocks';
import { ManualAccountCreationRoutes } from '@enums';

describe('EmployerDetailsFormComponent', () => {
  let component: EmployerDetailsFormComponent;
  let fixture: ComponentFixture<EmployerDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerDetailsFormComponent);
    component = fixture.componentInstance;

    component.form = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FORM_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create account page on handleBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleBack();
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.createAccount]);
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE_MOCK;
    spyOn(component['employerDetailsFormSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['employerDetailsFormSubmit'].emit).toHaveBeenCalledWith(formValue);
  });
});
