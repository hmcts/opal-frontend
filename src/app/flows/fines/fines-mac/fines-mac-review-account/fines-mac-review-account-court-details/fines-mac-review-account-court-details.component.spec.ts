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
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE } from '../../fines-mac-fixed-penalty-details/constants/fines-mac-fixed-penalty-details-store-state';
import { OPAL_FINES_PROSECUTOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-pretty-name.mock';
import { FINES_MAC_ACCOUNT_TYPES } from '../../constants/fines-mac-account-types';

describe('FinesMacReviewAccountCourtDetailsComponent', () => {
  let component: FinesMacReviewAccountCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountCourtDetailsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getCourtPrettyName: jasmine.createSpy('getCourtPrettyName').and.returnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
      getLocalJusticeAreaPrettyName: jasmine
        .createSpy('getLocalJusticeAreaPrettyName')
        .and.returnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
      getProsecutorPrettyName: jasmine
        .createSpy('getProsecutorPrettyName')
        .and.returnValue(OPAL_FINES_PROSECUTOR_PRETTY_NAME_MOCK),
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

    component.courtDetails = FINES_MAC_COURT_DETAILS_STATE_MOCK;
    component.localJusticeAreasData = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK;
    component.enforcementCourtsData = OPAL_FINES_COURT_REF_DATA_MOCK;
    component.prosecutorsData = OPAL_FINES_PROSECUTOR_REF_DATA_MOCK;

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
    spyOn(component.emitChangeCourtDetails, 'emit');

    component.changeCourtDetails();

    expect(component.emitChangeCourtDetails.emit).toHaveBeenCalled();
  });

  it('should call getCourtDetailsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getCourtDetailsData');

    component.ngOnInit();

    expect(component['getCourtDetailsData']).toHaveBeenCalled();
  });

  it('should get prosecutors prettyname from getProsecutor if id found', () => {
    component.fixedPenaltyDetails = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE;
    component.fixedPenaltyDetails.fm_court_details_issuing_authority_id = '1865';

    expect(component['getProsecutor']()).toBe('Police force (101)');
  });

  it('should get null from getProsecutor if id not found', () => {
    component.fixedPenaltyDetails = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE;
    component.fixedPenaltyDetails.fm_court_details_issuing_authority_id = 'xxx';

    expect(component['getProsecutor']()).toBe(null);
  });

  it('should get court data and set issuingAuthority from getCourtDetailsData for a fixed penalty account when issuing authority is a prosecutor', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getEnforcementCourt').and.stub();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getProsecutor').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getSendingCourt').and.callThrough();
    component.fixedPenaltyDetails = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE;
    component.fixedPenaltyDetails.fm_court_details_issuing_authority_id = '1865';
    component.accountType = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalled();
    expect(component['getSendingCourt']).toHaveBeenCalledTimes(0);
    expect(component.issuingAuthority).toBe('Police force (101)');
  });

  it('should get court data and set issuingAuthority from getCourtDetailsData for a fixed penalty account when issuing authority is a local justice authority', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getEnforcementCourt').and.stub();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getProsecutor').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getSendingCourt').and.callThrough();
    component.fixedPenaltyDetails = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE;
    component.fixedPenaltyDetails.fm_court_details_issuing_authority_id = '9985';
    component.accountType = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalled();
    expect(component['getSendingCourt']).toHaveBeenCalledTimes(1);
    expect(component.issuingAuthority).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should get court data and set sendingCourt from getCourtDetailsData for a non-fixed penalty account', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getEnforcementCourt').and.stub();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getProsecutor').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getSendingCourt').and.callThrough();
    component.fixedPenaltyDetails = FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE;
    component.fixedPenaltyDetails.fm_court_details_issuing_authority_id = '9985';
    component.accountType = FINES_MAC_ACCOUNT_TYPES['Fine'];

    component['getCourtDetailsData']();

    expect(component['getProsecutor']).toHaveBeenCalledTimes(0);
    expect(component['getSendingCourt']).toHaveBeenCalledTimes(1);
    expect(component.sendingCourt).toBe('Asylum & Immigration Tribunal (9985)');
  });

  it('should set card title based on account type', () => {
    component.accountType = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];
    component['setCardTitle']();
    expect(component.cardTitle).toBe('Issuing authority and court details');

    component.accountType = FINES_MAC_ACCOUNT_TYPES['Fine'];
    component['setCardTitle']();
    expect(component.cardTitle).toBe('Court details');
  });
});
