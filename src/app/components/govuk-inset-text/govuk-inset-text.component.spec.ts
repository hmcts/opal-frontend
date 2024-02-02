import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukInsetTextComponent } from './govuk-inset-text.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-inset-text insetTextId="test">Hello World</app-govuk-inset-text>`,
})
class TestHostComponent {}

describe('GovukInsetTextComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukInsetTextComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into inset-text', () => {
    const element = fixture.nativeElement.querySelector('#test');
    expect(element.innerText).toBe('Hello World');
  });
});
