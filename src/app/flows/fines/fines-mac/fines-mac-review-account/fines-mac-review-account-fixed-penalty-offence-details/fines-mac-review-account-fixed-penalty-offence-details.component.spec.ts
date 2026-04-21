import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent } from './fines-mac-review-account-fixed-penalty-offence-details.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-duplicate-code.mock';
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
    component.offenceDetails = structuredClone(FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK);

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
    const offenceCode = 'AK123456';
    component.getOffence(offenceCode);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(offenceCode);
    expect(component.offence).toBe('ak test (AK123456)');
  });

  it('should use the saved offence id when duplicate offences are returned', () => {
    component.offenceDetails.fm_offence_details_offence_id = 41800;
    mockOpalFinesService.getOffenceByCjsCode = vi
      .fn()
      .mockReturnValue(of(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK));

    component.getOffence('GMMET001');

    expect(component.offence).toBe('Duplicate offence title B (GMMET001)');
  });

  it('should fall back to the first offence title when duplicate offences are returned without a saved offence id', () => {
    component.offenceDetails.fm_offence_details_offence_id = null;
    mockOpalFinesService.getOffenceByCjsCode = vi
      .fn()
      .mockReturnValue(of(OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK));

    component.getOffence('GMMET001');

    expect(component.offence).toBe('Duplicate offence title A (GMMET001)');
  });

  it('should fall back to the offence code when no title data is returned', () => {
    mockOpalFinesService.getOffenceByCjsCode = vi.fn().mockReturnValue(
      of({
        count: 0,
        refData: [],
      }),
    );

    component.getOffence('UNKNOWN123');

    expect(component.offence).toBe('UNKNOWN123 (UNKNOWN123)');
  });
});
