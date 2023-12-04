import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosComponent } from './govuk-radios.component';
import { By } from '@angular/platform-browser';
import { SEARCH_TYPE_RADIOS_MOCK } from '@mocks';
import { FormControl } from '@angular/forms';

fdescribe('GovukRadiosComponent', () => {
  let component: GovukRadiosComponent;
  let fixture: ComponentFixture<GovukRadiosComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukRadiosComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.control = formControl;
    component.fieldSetId = 'search-type';
    component.legendText = 'Search Type';
    component.legendHintId = 'search-type';
    component.legendHint = 'This is a hint';
    component.legendClasses = 'test-class';

    component.radioInputs = SEARCH_TYPE_RADIOS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend text', () => {
    const elem = fixture.debugElement.query(By.css('#search-type .govuk-fieldset__legend')).nativeElement;

    expect(elem.textContent).toContain('Search Type');
  });

  it('should have legend hint', () => {
    const elem = fixture.debugElement.query(By.css('#search-type #search-type-hint')).nativeElement;

    expect(elem.textContent).toContain('This is a hint');
  });

  it('should have radio inputs', () => {
    const radioOne = fixture.debugElement.query(By.css('#search-type #defendant')).nativeElement;
    const radioTwo = fixture.debugElement.query(By.css('#search-type #minor-creditor')).nativeElement;

    expect(radioOne).toBeTruthy();
    expect(radioTwo).toBeTruthy();
  });

  it('should have radio input text divider', () => {
    const radioOne = fixture.debugElement.query(By.css('#search-type #defendant-radios-divider')).nativeElement;
    expect(radioOne.textContent).toContain('of');
  });

  it('should have added a class to teh radio', () => {
    const radioOne = fixture.debugElement.query(By.css('#search-type #minor-creditor'));
    expect(radioOne.classes['radio-test-class']).toBeTruthy();
  });

  it('should have radio input hint', () => {
    const radioOne = fixture.debugElement.query(By.css('#search-type #minor-creditor-item-hint')).nativeElement;
    expect(radioOne.textContent).toContain('Hint Hint');
  });

  it('should have added a class to the legend', () => {
    const elem = fixture.debugElement.query(By.css('#search-type .govuk-fieldset__legend.test-class')).nativeElement;
    expect(elem).toBeTruthy();
  });
});
