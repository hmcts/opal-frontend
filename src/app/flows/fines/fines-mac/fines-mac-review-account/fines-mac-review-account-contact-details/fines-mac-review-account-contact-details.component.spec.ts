import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountContactDetailsComponent } from './fines-mac-review-account-contact-details.component';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacReviewAccountContactDetailsComponent', () => {
  let component: FinesMacReviewAccountContactDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountContactDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountContactDetailsComponent);
    component = fixture.componentInstance;

    component.contactDetails = structuredClone(FINES_MAC_CONTACT_DETAILS_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change contact details event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangeContactDetails, 'emit');

    component.changeContactDetails();

    expect(component.emitChangeContactDetails.emit).toHaveBeenCalled();
  });
});
