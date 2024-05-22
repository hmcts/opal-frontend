import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesConditionalComponent } from './govuk-checkboxes-conditional.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-checkboxes-conditional conditionalId="test"> Hello World</app-govuk-checkboxes-conditional>`,
})
class TestHostComponent {}
describe('GovukCheckboxesConditionalComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesConditionalComponent],
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
    const element = fixture.nativeElement.querySelector('#test-conditional');
    expect(element.innerText).toBe('Hello World');
  });
});
