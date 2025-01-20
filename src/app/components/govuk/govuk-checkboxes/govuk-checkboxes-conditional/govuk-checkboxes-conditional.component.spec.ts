import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesConditionalComponent } from './govuk-checkboxes-conditional.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-checkboxes-conditional conditionalId="test"> Hello World</app-govuk-checkboxes-conditional>`,
  standalone: false,
})
class TestHostComponent {}
describe('GovukCheckboxesConditionalComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukCheckboxesConditionalComponent],
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

  it('should create with id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#test-conditional');
    expect(element.innerText).toBe('Hello World');
  });
});
