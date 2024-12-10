import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountChangeLinkComponent } from './fines-mac-review-account-change-link.component';

describe('FinesMacReviewAccountChangeLinkComponent', () => {
  let component: FinesMacReviewAccountChangeLinkComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountChangeLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountChangeLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountChangeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change link event', () => {
    spyOn(component.emitChange, 'emit');

    component.changeData();

    expect(component.emitChange.emit).toHaveBeenCalled();
  });
});
