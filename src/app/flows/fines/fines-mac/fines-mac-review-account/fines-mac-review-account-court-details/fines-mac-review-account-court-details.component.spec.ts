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

describe('FinesMacReviewAccountCourtDetailsComponent', () => {
  let component: FinesMacReviewAccountCourtDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountCourtDetailsComponent> | null;
  let mockOpalFinesService: Partial<OpalFines> | null;

  beforeEach(async () => {
    mockOpalFinesService = {
      getCourtPrettyName: jasmine.createSpy('getCourtPrettyName').and.returnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
      getLocalJusticeAreaPrettyName: jasmine
        .createSpy('getLocalJusticeAreaPrettyName')
        .and.returnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
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
    component.enforcementCourtsData = OPAL_FINES_COURT_REF_DATA_MOCK.refData;
    component.localJusticeAreasData = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData;

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockOpalFinesService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve and set enforcement court details on init', () => {
    if (!component || !mockOpalFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    component['getEnforcementCourt']();

    expect(mockOpalFinesService.getCourtPrettyName).toHaveBeenCalled();
    expect(component.enforcementCourt).toBe(OPAL_FINES_COURT_PRETTY_NAME_MOCK);
  });

  it('should retrieve and set sending court details on init', () => {
    if (!component || !mockOpalFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    component['getSendingCourt']();

    expect(mockOpalFinesService.getLocalJusticeAreaPrettyName).toHaveBeenCalled();
    expect(component.sendingCourt).toBe(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK);
  });

  it('should emit change court details event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeCourtDetails, 'emit');

    component.changeCourtDetails();

    expect(component.emitChangeCourtDetails.emit).toHaveBeenCalled();
  });

  it('should call getCourtDetailsData on init', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getCourtDetailsData');

    component.ngOnInit();

    expect(component['getCourtDetailsData']).toHaveBeenCalled();
  });
});
