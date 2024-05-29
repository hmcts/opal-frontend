import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryCardListComponent } from './govuk-summary-card-list.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-govuk-summary-card-list cardTitle="Testing Summary Card List"
    ><li actions>Test</li>
    <p content>Hello World</p></app-govuk-summary-card-list
  >`,
})
class TestHostComponent {}

describe('GovukSummaryCardListComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryCardListComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card title and content correctly', () => {
    const element = fixture.nativeElement;

    // Check the card title
    const cardTitle = element.querySelector('.govuk-summary-card__title').innerText;
    expect(cardTitle).toBe('Testing Summary Card List');

    // Check for the presence of the li element with the word 'Test'
    const liElement = element.querySelector('.govuk-summary-card__actions li');
    expect(liElement).toBeTruthy();
    expect(liElement.innerText).toBe('Test');

    // Check the content
    const content = element.querySelector('.govuk-summary-card__content p').innerText;
    expect(content).toBe('Hello World');
  });
});
