import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountContactDetailsComponent } from './fines-mac-review-account-contact-details.component';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';

describe('FinesMacReviewAccountContactDetailsComponent', () => {
  let component: FinesMacReviewAccountContactDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountContactDetailsComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountContactDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountContactDetailsComponent);
    component = fixture.componentInstance;

    component.contactDetails = structuredClone(FINES_MAC_CONTACT_DETAILS_STATE_MOCK);

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change contact details event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeContactDetails, 'emit');

    component.changeContactDetails();

    expect(component.emitChangeContactDetails.emit).toHaveBeenCalled();
  });
});
