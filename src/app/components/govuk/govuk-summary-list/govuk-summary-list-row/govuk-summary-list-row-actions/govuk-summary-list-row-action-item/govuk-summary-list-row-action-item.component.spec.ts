import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowActionItemComponent } from './govuk-summary-list-row-action-item.component';

describe('GovukSummaryListRowActionItemComponent', () => {
  let component: GovukSummaryListRowActionItemComponent;
  let fixture: ComponentFixture<GovukSummaryListRowActionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListRowActionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSummaryListRowActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit linkClicked event when handleActionClick is called', () => {
    const linkClicked = 'change';
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    spyOn(component.linkClick, 'emit');

    component.handleActionClick(event, linkClicked);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.linkClick.emit).toHaveBeenCalledWith(linkClicked);
  });
});
