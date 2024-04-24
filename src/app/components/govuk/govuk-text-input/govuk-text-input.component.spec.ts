import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTextInputComponent } from './govuk-text-input.component';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('GovukTextInputComponent', () => {
  let component: GovukTextInputComponent;
  let fixture: ComponentFixture<GovukTextInputComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextInputComponent);
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
    component.labelClasses = labelClass;
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.govuk-label'));

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    expect(label.classes[labelClass]).toBeTruthy();
  });
});
