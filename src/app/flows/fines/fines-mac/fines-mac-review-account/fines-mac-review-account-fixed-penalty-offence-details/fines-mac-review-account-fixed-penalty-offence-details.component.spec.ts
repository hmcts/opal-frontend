import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent } from './fines-mac-review-account-fixed-penalty-offence-details.component';

describe('FinesMacReviewAccountContactDetailsComponent', () => {
  let component: FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change contact details event', () => {
    spyOn(component.emitChangeOffenceDetails, 'emit');

    component.changeOffenceDetails();

    expect(component.emitChangeOffenceDetails.emit).toHaveBeenCalled();
  });
});
