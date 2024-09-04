import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojHeaderNavigationItemComponent } from './moj-header-navigation-item.component';

describe('MojHeaderNavigationItemComponent', () => {
  let component: MojHeaderNavigationItemComponent;
  let fixture: ComponentFixture<MojHeaderNavigationItemComponent>;
  let eventMock: jasmine.SpyObj<Event>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojHeaderNavigationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojHeaderNavigationItemComponent);
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
