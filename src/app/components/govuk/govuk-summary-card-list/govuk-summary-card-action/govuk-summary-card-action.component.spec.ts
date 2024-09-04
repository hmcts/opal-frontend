import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryCardActionComponent } from './govuk-summary-card-action.component';
import { By } from '@angular/platform-browser';

describe('GovukSummaryCardActionComponent', () => {
  let component: GovukSummaryCardActionComponent;
  let fixture: ComponentFixture<GovukSummaryCardActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryCardActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSummaryCardActionComponent);
    component = fixture.componentInstance;

    component.cardTitle = 'Testing Summary Card Actions';
    component.actions = [
      { text: 'Change', route: 'Change Link' },
      { text: 'Remove', route: 'Remove Link' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find Change and Remove list items and verify visually hidden text', () => {
    const listItems = fixture.debugElement.queryAll(By.css('.govuk-summary-card__action'));

    const changeItem = listItems.find((item) => item.nativeElement.textContent.includes('Change'));
    const removeItem = listItems.find((item) => item.nativeElement.textContent.includes('Remove'));

    expect(changeItem).toBeTruthy();
    expect(removeItem).toBeTruthy();

    // Check for the presence of the visually hidden span and its content for Change
    const changeVisuallyHiddenSpan = changeItem?.nativeElement.querySelector('span.govuk-visually-hidden');
    expect(changeVisuallyHiddenSpan).toBeTruthy();
    expect(changeVisuallyHiddenSpan.textContent.trim()).toBe(component.cardTitle);

    // Check for the presence of the visually hidden span and its content for Remove
    const removeVisuallyHiddenSpan = removeItem?.nativeElement.querySelector('span.govuk-visually-hidden');
    expect(removeVisuallyHiddenSpan).toBeTruthy();
    expect(removeVisuallyHiddenSpan.textContent.trim()).toBe(component.cardTitle);
  });

  it('should test onClick', () => {
    const event = jasmine.createSpyObj(Event, ['preventDefault']);
    spyOn(component.clickEvent, 'emit');

    component.onClick(event, 'test');

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.clickEvent.emit).toHaveBeenCalledWith('test');
  });
});
