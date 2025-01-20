import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosDividerComponent } from './govuk-radios-divider.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-radios-divider> Hello World</app-govuk-radios-divider>`,
  imports: [GovukRadiosDividerComponent],
})
class TestHostComponent {}
describe('GovukRadiosDividerComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
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

  it('should project the ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('.govuk-radios__divider');
    expect(element.innerText).toBe('Hello World');
  });
});
