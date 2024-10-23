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

    component.actionText = 'Change';
    component.actionRoute = 'change';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test onClick', () => {
    const event = jasmine.createSpyObj(Event, ['preventDefault']);
    spyOn(component.clickEvent, 'emit');

    component.onClick(event, 'test');

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.clickEvent.emit).toHaveBeenCalledWith('test');
  });
});
