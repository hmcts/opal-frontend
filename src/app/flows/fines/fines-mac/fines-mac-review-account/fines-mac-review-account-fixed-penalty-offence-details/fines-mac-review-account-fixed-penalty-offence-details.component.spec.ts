import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent } from './fines-mac-review-account-fixed-penalty-offence-details.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { of } from 'rxjs';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK } from '../../fines-mac-fixed-penalty-details/mocks/fines-mac-fixed-penalty-details-store-state.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacReviewAccountFixedPenaltyDetailsComponent', () => {
  let component: FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: vi.fn().mockReturnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangeOffenceDetails, 'emit');

    component.changeOffenceDetails();

    expect(component.emitChangeOffenceDetails.emit).toHaveBeenCalled();
  });

  it('should get offence details by code', () => {
    const offenceCode = '12345';
    component.getOffence(offenceCode);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(offenceCode);
    expect(component.offence).toBe('ak test (12345)');
  });

  it('should use the exact offence match when multiple offences are returned', () => {
    const multiResultResponse: IOpalFinesOffencesRefData = {
      count: 4,
      refData: [
        {
          offence_id: 41799,
          get_cjs_code: 'CD71039',
          business_unit_id: 52,
          offence_title: 'Criminal damage to property valued under £5000',
          offence_title_cy: null,
          date_used_from: '1997-11-16T00:00:00Z',
          date_used_to: null,
          offence_oas: 'Contrary to sections 1(1) and 4 of the Criminal Damage Act 1971.',
          offence_oas_cy: null,
        },
        {
          offence_id: 30733,
          get_cjs_code: 'CD71039A',
          business_unit_id: 52,
          offence_title: 'Attempt criminal damage to property valued under £5000',
          offence_title_cy: null,
          date_used_from: '1971-01-01T00:00:00Z',
          date_used_to: null,
          offence_oas: 'Contrary to section 1(1) of the Criminal Attempts Act 1981.',
          offence_oas_cy: null,
        },
        {
          offence_id: 30734,
          get_cjs_code: 'CD71039B',
          business_unit_id: 52,
          offence_title: 'Aid, abet, counsel and procure damage under £5000',
          offence_title_cy: null,
          date_used_from: '1971-01-01T00:00:00Z',
          date_used_to: null,
          offence_oas: 'Contrary to sections 1(1) and 4 of the Criminal Damage Act 1971.',
          offence_oas_cy: null,
        },
        {
          offence_id: 30735,
          get_cjs_code: 'CD71039C',
          business_unit_id: 52,
          offence_title: 'Conspiracy to destroy or damage property under £5000',
          offence_title_cy: null,
          date_used_from: '1971-01-01T00:00:00Z',
          date_used_to: '2004-12-25T00:00:00Z',
          offence_oas: 'Contrary to section 1 of the Criminal Law Act 1977.',
          offence_oas_cy: null,
        },
      ],
    };

    mockOpalFinesService.getOffenceByCjsCode = vi.fn().mockReturnValue(of(multiResultResponse));

    component.getOffence('CD71039');

    expect(component.offence).toBe('Criminal damage to property valued under £5000 (CD71039)');
  });
});
