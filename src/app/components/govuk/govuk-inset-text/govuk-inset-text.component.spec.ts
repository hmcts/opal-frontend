import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukInsetTextComponent } from './govuk-inset-text.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-inset-text insetTextId="test">Hello World</app-govuk-inset-text>`,
  imports: [GovukInsetTextComponent],
})
class TestHostComponent {}

describe('GovukInsetTextComponent', () => {
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

  it('should render into inset-text', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test');
    expect(element.innerText).toBe('Hello World');
  });
});
