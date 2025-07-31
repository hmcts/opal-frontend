import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent } from './fines-mac-review-account-fixed-penalty-offence-details.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { of } from 'rxjs';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK } from '../../fines-mac-fixed-penalty-details/mocks/fines-mac-fixed-penalty-details-store-state.mock';

describe('FinesMacReviewAccountFixedPenaltyDetailsComponent', () => {
  let component: FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent);
    component = fixture.componentInstance;
    component.offenceDetails = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK;

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

  it('should convert date format correctly', () => {
    const date = '01/01/2023';
    const formattedDate = component.dateFormat(date);
    expect(formattedDate).toBe('01 January 2023');
  });

  it('should convert money to monetary string', () => {
    const amount = '1000';
    const monetaryString = component.toMonetaryString(amount);
    expect(monetaryString).toBe('£1000.00');
  });

  it('should get offence details by code', () => {
    const offenceCode = '12345';
    component.getOffence(offenceCode);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(offenceCode);
    expect(component.offence).toBe('ak test (12345)');
  });
});
