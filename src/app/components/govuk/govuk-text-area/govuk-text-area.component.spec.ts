import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, AbstractControl } from '@angular/forms';
import { GovukTextAreaComponent } from './govuk-text-area.component';

describe('GovukTextAreaComponent', () => {
  let component: GovukTextAreaComponent;
  let fixture: ComponentFixture<GovukTextAreaComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextAreaComponent);
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

  it('should set the control correctly', () => {
    const control: FormControl = new FormControl();
    component.control = control;
    expect(component.getControl).toBe(control);
  });

  it('should calculate the remaining character count correctly', () => {
    const control: AbstractControl = new FormControl('Hello, World!');
    component.control = control;
    expect(component.remainingCharacterCount).toBe(500 - 13);
  });

  it('should return the remaining character count when value is undefined', () => {
    const control: AbstractControl = new FormControl(undefined);
    component.control = control;
    expect(component.remainingCharacterCount).toBe(500);
  });

  it('should return true if there are errors', () => {
    component.errors = 'Some error message';
    expect(component.hasError()).toBe(true);
  });

  it('should return false if there are no errors', () => {
    component.errors = null;
    expect(component.hasError()).toBe(false);
  });
});
