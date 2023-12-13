import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosComponent } from './govuk-radios.component';
import { By } from '@angular/platform-browser';
import { SEARCH_TYPE_RADIOS_MOCK } from '@mocks';
import { FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

describe('GovukRadiosComponent', () => {
  let component: GovukRadiosComponent;
  let fixture: ComponentFixture<GovukRadiosComponent>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukRadiosComponent);
    component = fixture.componentInstance;
    formGroup = new FormGroup({
      searchType: new FormControl(null),
      conditionalOne: new FormControl(),
      conditionalTwo: new FormControl(),
    });

    component.group = formGroup;
    component.fieldSetId = 'searchType';
    component.legendText = 'Search Type';
    component.legendHint = 'This is a hint';
    component.legendClasses = 'test-class';

    component.radioInputs = SEARCH_TYPE_RADIOS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend text', () => {
    const elem = fixture.debugElement.query(By.css('#searchType .govuk-fieldset__legend')).nativeElement;

    expect(elem.textContent).toContain('Search Type');
  });

  it('should have legend hint', () => {
    const elem = fixture.debugElement.query(By.css('#searchType #searchTypeHint')).nativeElement;

    expect(elem.textContent).toContain('This is a hint');
  });

  it('should have radio inputs', () => {
    const radioOne = fixture.debugElement.query(By.css('#searchType #defendant')).nativeElement;
    const radioTwo = fixture.debugElement.query(By.css('#searchType #minorCreditor')).nativeElement;

    expect(radioOne).toBeTruthy();
    expect(radioTwo).toBeTruthy();
  });

  it('should have radio input text divider', () => {
    const radioOne = fixture.debugElement.query(By.css('#searchType #defendantRadiosDivider')).nativeElement;
    expect(radioOne.textContent).toContain('of');
  });

  it('should have added a class to the radio', () => {
    const radioOne = fixture.debugElement.query(By.css('#searchType #minorCreditor'));
    expect(radioOne.classes['radio-test-class']).toBeTruthy();
  });

  it('should have radio input hint', () => {
    const radioOne = fixture.debugElement.query(By.css('#searchType #minorCreditorItemHint')).nativeElement;
    expect(radioOne.textContent).toContain('Hint Hint');
  });

  it('should have added a class to the legend', () => {
    const elem = fixture.debugElement.query(By.css('#searchType .govuk-fieldset__legend.test-class')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should toggle the conditional', () => {
    const inputId = 'defendant';

    expect(component.toggleConditional).toEqual({});
    component.handleToggleConditional(inputId);
    expect(component.toggleConditional).toEqual({
      [inputId]: true,
    });

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    expect(fixture.debugElement.query(By.css(`#searchType #${inputId}Conditional`)).nativeElement).not.toBe(null);
  });
});
