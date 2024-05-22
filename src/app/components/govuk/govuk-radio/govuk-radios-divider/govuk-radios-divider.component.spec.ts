import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosDividerComponent } from './govuk-radios-divider.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-radios-divider> Hello World</app-govuk-radios-divider>`,
})
class TestHostComponent {}
describe('GovukRadiosDividerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosDividerComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should project the ng-content', () => {
    const element = fixture.nativeElement.querySelector('.govuk-radios__divider');
    expect(element.innerText).toBe('Hello World');
  });
});
