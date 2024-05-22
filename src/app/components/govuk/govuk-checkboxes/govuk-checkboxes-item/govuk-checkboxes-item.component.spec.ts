import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesItemComponent } from './govuk-checkboxes-item.component';
import { FormControl } from '@angular/forms';

describe('GovukCheckboxesItemComponent', () => {
  let component: GovukCheckboxesItemComponent;
  let fixture: ComponentFixture<GovukCheckboxesItemComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukCheckboxesItemComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.labelText = 'test';
    component.labelClasses = 'govuk-label--l';
    component.inputId = 'test';
    component.inputName = 'test';
    component.inputClasses = 'govuk-input--width-20';
    component.control = formControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have extra label classes', () => {
    const elem = fixture.nativeElement.querySelector('.govuk-checkboxes__label.govuk-label--l');
    expect(elem).toBeTruthy();
  });

  it('should have labelText', () => {
    const elem = fixture.nativeElement.querySelector('.govuk-label.govuk-label--l');
    expect(elem.textContent).toContain('test');
  });

  it('should have extra input classes', () => {
    const elem = fixture.nativeElement.querySelector('.govuk-checkboxes__input.govuk-input--width-20');
    expect(elem).toBeTruthy();
  });

  it('should have an input id', () => {
    const elem = fixture.nativeElement.querySelector('#test');
    expect(elem).toBeTruthy();
  });
});
