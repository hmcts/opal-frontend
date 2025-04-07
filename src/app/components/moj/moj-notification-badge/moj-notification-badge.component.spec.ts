import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojNotificationBadgeComponent } from './moj-notification-badge.component';

describe('MojNotificationBadgeComponent', () => {
  let component: MojNotificationBadgeComponent;
  let fixture: ComponentFixture<MojNotificationBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojNotificationBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojNotificationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
