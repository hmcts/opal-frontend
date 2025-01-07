import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukDateInputComponent } from './govuk-date-input.component';
import { FormControl, FormGroup } from '@angular/forms';
import { GOVUK_DATE_INPUTS_MOCK } from './mocks';
import { By } from '@angular/platform-browser';

describe('GovukDateInputComponent', () => {
  let component: GovukDateInputComponent | null;
  let fixture: ComponentFixture<GovukDateInputComponent> | null;
  let formGroup: FormGroup | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukDateInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukDateInputComponent);
    component = fixture.componentInstance;
    formGroup = new FormGroup({
      dayOfBirth: new FormControl(),
      monthOfBirth: new FormControl(),
      yearOfBirth: new FormControl(),
    });

    component.group = formGroup;
    component.fieldSetId = 'dateOfBirth';
    component.legendText = 'Date of Birth';
    component.legendHint = 'For example, 04 06 1991';
    component.legendClasses = 'test-class';
    component.dateInputs = GOVUK_DATE_INPUTS_MOCK;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    formGroup = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend text', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('#dateOfBirth .govuk-fieldset__legend')).nativeElement;

    expect(elem.textContent).toContain('Date of Birth');
  });

  it('should have legend hint', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('#dateOfBirth #dateOfBirthHint')).nativeElement;

    expect(elem.textContent).toContain('For example, 04 06 1991');
  });

  it('should have date inputs', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const day = fixture.debugElement.query(By.css('#dateOfBirth #dayOfBirth')).nativeElement;
    const month = fixture.debugElement.query(By.css('#dateOfBirth #monthOfBirth')).nativeElement;
    const year = fixture.debugElement.query(By.css('#dateOfBirth #yearOfBirth')).nativeElement;

    expect(day).toBeTruthy();
    expect(month).toBeTruthy();
    expect(year).toBeTruthy();
  });

  it('should have added a class to the legend', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('#dateOfBirth .govuk-fieldset__legend.test-class')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should have added a class to the day input', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const day = fixture.debugElement.query(By.css('#dateOfBirth #dayOfBirth.govuk-input--width-2')).nativeElement;
    const month = fixture.debugElement.query(By.css('#dateOfBirth #monthOfBirth.govuk-input--width-2')).nativeElement;
    const year = fixture.debugElement.query(By.css('#dateOfBirth #yearOfBirth.govuk-input--width-4')).nativeElement;

    expect(day).toBeTruthy();
    expect(month).toBeTruthy();
    expect(year).toBeTruthy();
  });
});
