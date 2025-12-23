import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccDefendantDetailsEnforcementTab } from './fines-acc-defendant-details-enforcement-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_COURT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-data-non-snake-case.mock';

describe('FinesAccDefendantDetailsEnforcementTab', () => {
  let component: FinesAccDefendantDetailsEnforcementTab;
  let fixture: ComponentFixture<FinesAccDefendantDetailsEnforcementTab>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(async () => {
    mockOpalFinesService = jasmine.createSpyObj<OpalFines>('OpalFines', ['getCourtPrettyName']);
    mockOpalFinesService.getCourtPrettyName.and.returnValue(
      `${OPAL_FINES_COURT_NON_SNAKE_CASE_MOCK.name} (${OPAL_FINES_COURT_NON_SNAKE_CASE_MOCK.courtCode})`,
    );

    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsEnforcementTab],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsEnforcementTab);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    component.enforcementCourt = structuredClone(OPAL_FINES_COURT_NON_SNAKE_CASE_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set enforcement court pretty name when enforcement court provided', () => {
    expect(component.enforcementCourtPrettyName).toEqual(
      `${OPAL_FINES_COURT_NON_SNAKE_CASE_MOCK.name} (${OPAL_FINES_COURT_NON_SNAKE_CASE_MOCK.courtCode})`,
    );
  });
});
