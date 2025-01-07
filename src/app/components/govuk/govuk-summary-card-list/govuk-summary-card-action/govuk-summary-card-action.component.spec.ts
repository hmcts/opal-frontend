import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukSummaryCardActionComponent } from './govuk-summary-card-action.component';

describe('GovukSummaryCardActionComponent', () => {
  let component: GovukSummaryCardActionComponent | null;
  let fixture: ComponentFixture<GovukSummaryCardActionComponent> | null;

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

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test onClick', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const event = jasmine.createSpyObj(Event, ['preventDefault']);
    spyOn(component.clickEvent, 'emit');

    component.onClick(event, 'test');

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.clickEvent.emit).toHaveBeenCalledWith('test');
  });
});
