import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowActionItemsComponent } from './govuk-summary-list-row-action-items.component';

describe('GovukSummaryListRowActionItemsComponent', () => {
  let component: GovukSummaryListRowActionItemsComponent;
  let fixture: ComponentFixture<GovukSummaryListRowActionItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListRowActionItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSummaryListRowActionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit linkClicked event when handleActionClick is called', () => {
    const linkClicked = 'example-link';
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    spyOn(component.linkClick, 'emit');

    component.handleActionClick(event, linkClicked);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.linkClick.emit).toHaveBeenCalledWith(linkClicked);
  });
});
