import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListComponent } from './govuk-summary-list.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-summary-list summaryListId="test">Hello World</app-govuk-summary-list>`,
})
class TestHostComponent {}

describe('GovukSummaryListComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into list ng-content', () => {
    const element = fixture.nativeElement.querySelector('#test');
    expect(element.innerText).toBe('Hello World');
  });
});
