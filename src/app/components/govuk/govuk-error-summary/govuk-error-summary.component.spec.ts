import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukErrorSummaryComponent } from './govuk-error-summary.component';

describe('GovukErrorSummaryComponent', () => {
  let component: GovukErrorSummaryComponent | null;
  let fixture: ComponentFixture<GovukErrorSummaryComponent> | null;
  let eventMock: jasmine.SpyObj<Event> | null;

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

  afterAll(() => {
    fixture = null;
    component = null;
    eventMock = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleErrorClick', () => {
    if (!component || !eventMock) {
      fail('component or eventMock returned null');
      return;
    }

    component.handleErrorClick(eventMock, 'testFieldId');
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(component.errorClick.emit).toHaveBeenCalledWith('testFieldId');
  });
});
