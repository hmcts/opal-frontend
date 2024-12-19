import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCamInputterComponent } from './fines-draft-cam-inputter.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of } from 'rxjs';
import { DateService } from '@services/date-service/date.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { FINES_MAC_STATE_MOCK } from '../../../fines-mac/mocks/fines-mac-state.mock';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths';

describe('FinesDraftCamInputterComponent', () => {
  let component: FinesDraftCamInputterComponent;
  let fixture: ComponentFixture<FinesDraftCamInputterComponent>;
  let mockGlobalStateService: GlobalStateService;
  const mockFinesService: jasmine.SpyObj<FinesService> = jasmine.createSpyObj<FinesService>('FinesService', [
    'finesMacState',
    'finesDraftState',
  ]);
  const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
    jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['convertPayloadToFinesMacState']);
  const mockOpalFinesService: Partial<OpalFines> = {
    getDraftAccounts: jasmine.createSpy('getDraftAccounts').and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)),
    getDraftAccountById: jasmine.createSpy('getDraftAccountById').and.returnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT)),
  };
  const mockDateService: jasmine.SpyObj<DateService> = jasmine.createSpyObj<DateService>('DateService', [
    'getFromFormatToFormat',
    'getDaysAgoString',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCamInputterComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('review'),
          },
        },
      ],
    }).compileComponents();

    mockGlobalStateService = TestBed.inject(GlobalStateService);
    mockGlobalStateService.userState.set(SESSION_USER_STATE_MOCK);

    fixture = TestBed.createComponent(FinesDraftCamInputterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate draftAccounts$', () => {
    expect(component['draftAccounts$']).not.toBeUndefined();
  });

  it('should switch tab and fetch draft accounts data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'getDraftAccountsData');
    component.handleTabSwitch(FINES_DRAFT_TAB_STATUSES[1].tab);
    expect(component.activeTab).toEqual(FINES_DRAFT_TAB_STATUSES[1].tab);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).getDraftAccountsData).toHaveBeenCalled();
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
    expect(mockDateService.getFromFormatToFormat).toHaveBeenCalled();
    expect(mockDateService.getDaysAgoString).toHaveBeenCalled();
  });

  it('should populate table data correctly', () => {
    const response = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    const tableData = component['populateTableData'](response);
    expect(tableData.length).toEqual(response.summaries.length);
    expect(tableData[0].defendantId).toEqual(response.summaries[0].draft_account_id);
  });

  it('should call getDraftAccounts with correct parameters', () => {
    const statuses = FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === 'review')?.statuses;
    const params = {
      businessUnitIds: component['businessUnitIds'],
      statuses,
      submittedBy: component['businessUnitUserIds'],
    };
    component.activeTab = 'review';
    component['getDraftAccountsData']();
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith(params);
  });

  it('should update fines state correctly', () => {
    const response = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    component['updateFinesState'](response);
    expect(mockFinesService.finesDraftState).toEqual(response);
    expect(mockFinesService.finesMacState).toEqual(mockFinesMacPayloadService.convertPayloadToFinesMacState(response));
  });

  it('should navigate to review account', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component['finesService'].finesMacState = { ...FINES_MAC_STATE_MOCK };
    component['navigateToReviewAccount']();
    expect(routerSpy).toHaveBeenCalledWith([
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`,
      FINES_MAC_STATE_MOCK.accountDetails.formData.fm_create_account_business_unit_id,
    ]);
  });

  it('should handle defendant click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'updateFinesState');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'navigateToReviewAccount');
    component.onDefendantClick(1);
    expect(mockOpalFinesService.getDraftAccountById).toHaveBeenCalledWith(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).updateFinesState).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).navigateToReviewAccount).toHaveBeenCalled();
  });

  it('should switch tab correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'getDraftAccountsData');
    component['switchTab']('review');
    expect(component.activeTab).toEqual('review');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).getDraftAccountsData).toHaveBeenCalled();
  });

  it('should handle tab switch', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'switchTab');
    component.handleTabSwitch('review');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).switchTab).toHaveBeenCalledWith('review');
  });

  it('should initialize with default state', () => {
    component.ngOnInit();
    expect(mockFinesService.finesDraftState).toEqual(FINES_DRAFT_STATE);
  });
});
