import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosItemComponent } from './govuk-radios-item.component';
import { FormControl } from '@angular/forms';

describe('GovukRadiosItemComponent', () => {
  let component: GovukRadiosItemComponent | null;
  let fixture: ComponentFixture<GovukRadiosItemComponent> | null;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukRadiosItemComponent);
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

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have extra label classes', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('.govuk-radios__label.govuk-label--l');
    expect(elem).toBeTruthy();
  });

  it('should have labelText', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('.govuk-label.govuk-label--l');
    expect(elem.textContent).toContain('test');
  });

  it('should have extra input classes', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('.govuk-radios__input.govuk-input--width-20');
    expect(elem).toBeTruthy();
  });

  it('should have an input id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('#test');
    expect(elem).toBeTruthy();
  });
});
