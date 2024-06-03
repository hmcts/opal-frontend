import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsFormComponent } from './personal-details-form.component';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK } from '@mocks';
import { FormArray } from '@angular/forms';

describe('PersonalDetailsFormComponent', () => {
  let component: PersonalDetailsFormComponent;
  let fixture: ComponentFixture<PersonalDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should remove an alias from the form', () => {
    component.addAliases(1);

    const aliases = component.form.get('aliases') as FormArray;
    expect(aliases.length).toBe(2);

    component.removeAlias(1);

    expect(aliases.length).toBe(1);
    expect(component.aliasControls.length).toBe(1);
    expect(component.fieldErrors['firstName_1']).toBeUndefined();
    expect(component.fieldErrors['lastName_1']).toBeUndefined();
  });
});
