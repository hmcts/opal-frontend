import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowActionsComponent } from './govuk-summary-list-row-actions.component';

describe('GovukSummaryListRowActionsComponent', () => {
  let component: GovukSummaryListRowActionsComponent;
  let fixture: ComponentFixture<GovukSummaryListRowActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListRowActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSummaryListRowActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit linkClicked event when handleActionClick is called', () => {
    const linkClicked = 'example-link';
    const event = new Event('click');
    spyOn(component.linkClick, 'emit');

    component.handleActionClick(event, linkClicked);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.linkClick.emit).toHaveBeenCalledWith(linkClicked);
  });
});
