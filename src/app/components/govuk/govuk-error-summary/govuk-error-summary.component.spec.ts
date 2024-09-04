import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukErrorSummaryComponent } from './govuk-error-summary.component';

describe('GovukErrorSummaryComponent', () => {
  let component: GovukErrorSummaryComponent;
  let fixture: ComponentFixture<GovukErrorSummaryComponent>;
  let eventMock: jasmine.SpyObj<Event>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukErrorSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukErrorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    eventMock = jasmine.createSpyObj(Event, ['preventDefault']);
    spyOn(component.errorClick, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleErrorClick', () => {
    component.handleErrorClick(eventMock, 'testFieldId');
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(component.errorClick.emit).toHaveBeenCalledWith('testFieldId');
  });
});
