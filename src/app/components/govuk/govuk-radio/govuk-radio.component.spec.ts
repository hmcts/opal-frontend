import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadioComponent } from './govuk-radio.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-radio
    fieldSetId="test"
    legendText="Legend Text"
    legendHint="Legend Hint"
    legendClasses="legend-class"
    radioClasses="radio-class"
  >
    Hello World</app-govuk-radio
  >`,
  standalone: false,
})
class TestHostComponent {}
describe('GovukRadioComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadioComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
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

  it('should render into the Legend Text', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend ');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should render into the Legend Hint', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#testHint');
    expect(element.innerText).toBe('Legend Hint');
  });

  it('should add a legend class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend.legend-class');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should add a radio class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#test > .radio-class');
    expect(element.innerText).toBe('Hello World');
  });
});
