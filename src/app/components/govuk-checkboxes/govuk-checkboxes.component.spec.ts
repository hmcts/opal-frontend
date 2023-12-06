import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesComponent } from './govuk-checkboxes.component';
import { FormControl, FormGroup } from '@angular/forms';
import { COMPANY_CHECKBOXES_MOCK } from '@mocks';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('GovukCheckboxesComponent', () => {
  let component: GovukCheckboxesComponent;
  let fixture: ComponentFixture<GovukCheckboxesComponent>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukCheckboxesComponent);
    component = fixture.componentInstance;
    formGroup = new FormGroup({
      company: new FormControl(null),
      companyName: new FormControl(),
    });

    component.group = formGroup;
    component.fieldSetId = 'companyCheckbox';
    component.legendText = 'Company';
    component.legendHintId = 'companyCheckbox';
    component.legendHint = 'This is a hint';
    component.legendClasses = 'test-class';

    component.checkboxInputs = COMPANY_CHECKBOXES_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend text', () => {
    const elem = fixture.debugElement.query(By.css('#companyCheckbox .govuk-fieldset__legend')).nativeElement;

    expect(elem.textContent).toContain('Company');
  });

  it('should have legend hint', () => {
    const elem = fixture.debugElement.query(By.css('#companyCheckbox #companyCheckboxHint')).nativeElement;

    expect(elem.textContent).toContain('This is a hint');
  });

  it('should have a checkbox', () => {
    const checkbox = fixture.debugElement.query(By.css('#companyCheckbox #company')).nativeElement;

    expect(checkbox).toBeTruthy();
  });

  it('should have a checkbox text divider', () => {
    const checkbox = fixture.debugElement.query(By.css('#companyCheckbox #companyCheckboxesDivider')).nativeElement;

    expect(checkbox.textContent).toContain('Or');
  });

  it('should have added a class to the checkbox', () => {
    const radioOne = fixture.debugElement.query(By.css('#companyCheckbox #company'));
    expect(radioOne.classes['checkbox-test-class']).toBeTruthy();
  });

  it('should have added a class to the legend', () => {
    const elem = fixture.debugElement.query(
      By.css('#companyCheckbox .govuk-fieldset__legend.test-class'),
    ).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should toggle the conditional', () => {
    const inputId = 'company';

    expect(component.toggleConditional).toEqual({});
    component.handleToggleConditional(inputId);
    expect(component.toggleConditional).toEqual({
      [inputId]: true,
    });

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef as any);
    cdr.detectChanges();

    expect(fixture.debugElement.query(By.css(`#companyCheckbox #${inputId}Conditional`)).nativeElement).not.toBe(null);
  });
});
