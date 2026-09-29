import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountCourtDetailsComponent } from './fines-mac-review-account-court-details.component';
import { OPAL_FINES_COURT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-pretty-name.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_COURT_DETAILS_STATE_MOCK } from '../../fines-mac-court-details/mocks/fines-mac-court-details-state.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-pretty-name.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-pretty-name.mock';
import { FINES_ACCOUNT_TYPES } from '../../../constants/fines-account-types.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacReviewAccountCourtDetailsComponent', () => {
  let component: FinesMacReviewAccountCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountCourtDetailsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getCourtPrettyName: vi.fn().mockReturnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
      getLocalJusticeAreaPrettyName: vi.fn().mockReturnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
      getProsecutorPrettyName: vi.fn().mockReturnValue(OPAL_FINES_PROSECUTOR_PRETTY_NAME_MOCK),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountCourtDetailsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountCourtDetailsComponent);
    component = fixture.componentInstance;

    component.courtDetails = structuredClone(FINES_MAC_COURT_DETAILS_STATE_MOCK);
    component.localJusticeAreasData = structuredClone(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK);
    component.enforcementCourtsData = structuredClone(OPAL_FINES_COURT_REF_DATA_MOCK);
    component.prosecutorsData = structuredClone(OPAL_FINES_PROSECUTOR_REF_DATA_MOCK);
    component.release1a1_1Enabled = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and set enforcement court details on init', () => {
    component['getEnforcementCourt']();

    expect(mockOpalFinesService.getCourtPrettyName).toHaveBeenCalled();
    expect(component.enforcementCourt).toBe(OPAL_FINES_COURT_PRETTY_NAME_MOCK);
  });

  it('should retrieve and set sending court details on init', () => {
    component.sendingCourt = component['getSendingCourt']('9985');

    expect(mockOpalFinesService.getLocalJusticeAreaPrettyName).toHaveBeenCalled();
    expect(component.sendingCourt).toBe(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK);
  });

  it('should emit change court details event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangeCourtDetails, 'emit');

    component.changeCourtDetails();

    expect(component.emitChangeCourtDetails.emit).toHaveBeenCalled();
  });

  it('should call getCourtDetailsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getCourtDetailsData');

    component.ngOnInit();

    expect(component['getCourtDetailsData']).toHaveBeenCalled();
  });

  it('should get prosecutors prettyname from getProsecutor if id found', () => {
    component.courtDetails.fm_court_details_originator_id = '1865';

    expect(component['getProsecutor']()).toBe('Police force (101)');
  });

  it('should get court data and set issuingAuthority from getCourtDetailsData for a fixed penalty account when issuing authority is a prosecutor', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.courtDetails.fm_court_details_originator_id = '1865';
    component.accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalled();
    expect(component['getSendingCourt']).toHaveBeenCalledTimes(0);
    expect(component.issuingAuthority).toBe('Police force (101)');
  });

  it('should keep an LJA-backed fixed penalty draft visible when release-1a-1.1 is enabled', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.courtDetails.fm_court_details_originator_id = '9985';
    component.accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalled();
    expect(component['getSendingCourt']).toHaveBeenCalledWith('9985');
    expect(component.issuingAuthority).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should use prosecutor data first for a fixed penalty account when release-1a-1.1 is disabled', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.release1a1_1Enabled = false;
    component.courtDetails.fm_court_details_originator_id = '1865';
    component.accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalledTimes(1);
    expect(component['getSendingCourt']).not.toHaveBeenCalled();
    expect(component.issuingAuthority).toBe('Police force (101)');
  });

  it('should fall back to local justice area data for a fixed penalty account when release-1a-1.1 is disabled', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.release1a1_1Enabled = false;
    component.courtDetails.fm_court_details_originator_id = '9985';
    component.accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalledTimes(1);
    expect(component['getSendingCourt']).toHaveBeenCalledWith('9985');
    expect(component.issuingAuthority).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should use the stored originator name when neither reference dataset contains a fixed penalty originator', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor').mockReturnValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt').mockReturnValue(null);
    component.courtDetails.fm_court_details_originator_id = '9999';
    component.courtDetails.fm_court_details_originator_name = 'Persisted issuing authority';
    component.accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component.issuingAuthority).toBe('Persisted issuing authority');
  });

  it('should use prosecutor data for a conditional caution sending police force', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.courtDetails.fm_court_details_originator_id = '1865';
    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalledTimes(1);
    expect(component['getSendingCourt']).not.toHaveBeenCalled();
    expect(component.sendingCourt).toBe('Police force (101)');
  });

  it('should use local justice area data for a conditional caution when release-1a-1.1 is disabled', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.release1a1_1Enabled = false;
    component.courtDetails.fm_court_details_originator_id = '9985';
    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).not.toHaveBeenCalled();
    expect(component['getSendingCourt']).toHaveBeenCalledWith('9985');
    expect(component.sendingCourt).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should keep an LJA-backed conditional caution draft visible when release-1a-1.1 is enabled', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.courtDetails.fm_court_details_originator_id = '9985';
    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalledTimes(1);
    expect(component['getSendingCourt']).toHaveBeenCalledWith('9985');
    expect(component.sendingCourt).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should keep a prosecutor-backed conditional caution draft visible when release-1a-1.1 is disabled', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.release1a1_1Enabled = false;
    component.courtDetails.fm_court_details_originator_id = '1865';
    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];

    component['getCourtDetailsData']();

    expect(component['getSendingCourt']).toHaveBeenCalledWith('1865');
    expect(component['getProsecutor']).toHaveBeenCalledTimes(1);
    expect(component.sendingCourt).toBe('Police force (101)');
  });

  it('should use the stored originator name when neither reference dataset contains a conditional caution originator', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor').mockReturnValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt').mockReturnValue(null);
    component.courtDetails.fm_court_details_originator_id = '9999';
    component.courtDetails.fm_court_details_originator_name = 'Persisted originator';
    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];

    component['getCourtDetailsData']();

    expect(component.sendingCourt).toBe('Persisted originator');
  });

  it('should use the stored originator name for a conditional caution when release-1a-1.1 is disabled and neither reference dataset contains the originator', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt').mockReturnValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor').mockReturnValue(null);
    component.release1a1_1Enabled = false;
    component.courtDetails.fm_court_details_originator_id = '9999';
    component.courtDetails.fm_court_details_originator_name = 'Persisted originator';
    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];

    component['getCourtDetailsData']();

    expect(component['getSendingCourt']).toHaveBeenCalledWith('9999');
    expect(component['getProsecutor']).toHaveBeenCalledTimes(1);
    expect(component.sendingCourt).toBe('Persisted originator');
  });

  it('should get court data and set sendingCourt from getCourtDetailsData for a non-fixed penalty account', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getEnforcementCourt').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getSendingCourt');
    component.courtDetails.fm_court_details_originator_id = '9985';
    component.accountType = FINES_ACCOUNT_TYPES['Fine'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalledTimes(0);
    expect(component['getSendingCourt']).toHaveBeenCalledTimes(1);
    expect(component.sendingCourt).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should set card title based on account type', () => {
    component.accountType = FINES_ACCOUNT_TYPES['Fixed Penalty'];
    expect(component.cardTitle).toBe('Issuing authority and court details');

    component.accountType = FINES_ACCOUNT_TYPES['Fine'];
    expect(component.cardTitle).toBe('Court details');

    component.accountType = FINES_ACCOUNT_TYPES['Conditional Caution'];
    expect(component.cardTitle).toBe('Police and court details');
  });
});
