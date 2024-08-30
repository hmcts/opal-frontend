import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { GovukTextInputPrefixSuffixComponent } from './govuk-text-input-prefix-suffix.component';

describe('GovukTextInputPrefixSuffixComponent', () => {
  let component: GovukTextInputPrefixSuffixComponent;
  let fixture: ComponentFixture<GovukTextInputPrefixSuffixComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextInputPrefixSuffixComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextInputPrefixSuffixComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.labelText = 'test';
    component.labelClasses = 'govuk-label--l';
    component.inputId = 'test';
    component.inputName = 'test';
    component.control = formControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have extra label classes', () => {
    const elem = fixture.debugElement.query(By.css('.govuk-label.govuk-label--l')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should have labelText', () => {
    const elem = fixture.debugElement.query(By.css('.govuk-label.govuk-label--l')).nativeElement;
    expect(elem.textContent).toContain('test');
  });

  it('should have extra input classes', () => {
    const labelClass = 'govuk-input--width-20';
    component.inputClasses = labelClass;
    fixture.detectChanges();

    const elem = fixture.debugElement.query(By.css('.govuk-input'));

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    expect(elem.classes[labelClass]).toBeTruthy();
  });

  it('should have a prefix and suffix attached to the input', () => {
    component.prefixText = '£';
    component.suffixText = 'per item';
    fixture.detectChanges();

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    const prefixElem = fixture.debugElement.query(By.css('.govuk-input__prefix'));
    const suffixElem = fixture.debugElement.query(By.css('.govuk-input__suffix'));

    expect(prefixElem.nativeElement.textContent.trim()).toBe(component.prefixText);
    expect(suffixElem.nativeElement.textContent.trim()).toBe(component.suffixText);
  });

  it('should return false when errors is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).errors = undefined;
    expect(component.hasError()).toBe(false);
  });
});
