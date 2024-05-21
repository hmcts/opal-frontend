import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadioNewComponent } from './govuk-radio-new.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-radio-new
    fieldSetId="test"
    legendText="Legend Text"
    legendHint="Legend Hint"
    legendClasses="legend-class"
    radioClasses="radio-class"
  >
    Hello World</app-govuk-radio-new
  >`,
})
class TestHostComponent {}
describe('GovukRadioNewComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadioNewComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should add a radio class', () => {
    const element = fixture.nativeElement.querySelector('#test > .radio-class');
    expect(element.innerText).toBe('Hello World');
  });
});
