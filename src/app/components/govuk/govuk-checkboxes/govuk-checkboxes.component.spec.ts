import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesComponent } from './govuk-checkboxes.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-checkboxes
    fieldSetId="test"
    legendText="Legend Text"
    legendHint="Legend Hint"
    legendClasses="legend-class"
    checkboxClasses="checkbox-class"
  >
    Hello World</app-govuk-checkboxes
  >`,
})
class TestHostComponent {}
describe('GovukCheckboxesNewComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into the Legend Text', () => {
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend ');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should render into the Legend Hint', () => {
    const element = fixture.nativeElement.querySelector('#testHint');
    expect(element.innerText).toBe('Legend Hint');
  });

  it('should add a legend class', () => {
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend.legend-class');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should add a checkbox class', () => {
    const element = fixture.nativeElement.querySelector('#test > .checkbox-class');
    expect(element.innerText).toBe('Hello World');
  });
});
