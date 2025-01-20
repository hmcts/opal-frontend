import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesDividerComponent } from './govuk-checkboxes-divider.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-checkboxes-divider> Hello World</app-govuk-checkboxes-divider>`,
  standalone: false,
})
class TestHostComponent {}
describe('GovukCheckboxesDividerComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesDividerComponent],
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

  it('should project the ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('.govuk-checkboxes__divider');
    expect(element.innerText).toBe('Hello World');
  });
});
