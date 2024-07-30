import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukDetailsComponent } from './govuk-details.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<app-govuk-details summaryText="Test Link"><p>This is a test</p></app-govuk-details>`,
})
class TestHostComponent {}

describe('GovukDetailsComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukDetailsComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render summary link - Test Link', () => {
    const element = fixture.debugElement.query(By.css('.govuk-details__summary-text'));
    expect(element.nativeElement.textContent).toContain('Test Link');
  });

  it('should render detail text - This is a test', () => {
    const element = fixture.debugElement.query(By.css('.govuk-details__text'));
    expect(element.nativeElement.textContent).toContain('This is a test');
  });
});
