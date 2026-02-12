import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsFixedPenaltyTabComponent } from './fines-acc-defendant-details-fixed-penalty-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-fixed-penalty.mock';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccDefendantDetailsAtAGlanceTabComponent', () => {
  let component: FinesAccDefendantDetailsFixedPenaltyTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsFixedPenaltyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsFixedPenaltyTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsFixedPenaltyTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
