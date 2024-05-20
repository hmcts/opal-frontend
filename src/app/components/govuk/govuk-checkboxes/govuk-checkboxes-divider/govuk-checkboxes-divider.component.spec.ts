import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesDividerComponent } from './govuk-checkboxes-divider.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-checkboxes-divider> Hello World</app-govuk-checkboxes-divider>`,
})
class TestHostComponent {}
describe('GovukCheckboxesDividerComponent', () => {
  let component: GovukCheckboxesDividerComponent;
  let fixture: ComponentFixture<GovukCheckboxesDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesDividerComponent],
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
    const element = fixture.nativeElement.querySelector('.govuk-checkboxes__divider');
    expect(element.innerText).toBe('Hello World');
  });
});
