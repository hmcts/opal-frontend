import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeaderNavigationItemComponent } from './govuk-header-navigation-item.component';

describe('GovukHeaderNavigationItemComponent', () => {
  let component: GovukHeaderNavigationItemComponent;
  let fixture: ComponentFixture<GovukHeaderNavigationItemComponent>;
  let eventMock: jasmine.SpyObj<Event>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeaderNavigationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeaderNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    eventMock = jasmine.createSpyObj(Event, ['preventDefault']);
    spyOn(component.actionClick, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleClick', () => {
    component.handleClick(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(component.actionClick.emit).toHaveBeenCalledWith(true);
  });
});
