import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCheckAndManageTabsComponent } from './fines-draft-check-and-manage-tabs.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { ActivatedRoute } from '@angular/router';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';

describe('FinesDraftCheckAndManageTabsComponent', () => {
  let component: FinesDraftCheckAndManageTabsComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndManageTabsComponent>;
  let globalStore: GlobalStoreType;
  let finesDraftStore: FinesDraftStoreType;
  const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
    jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);
  const mockOpalFinesService: Partial<OpalFines> = {
    getDraftAccounts: jasmine.createSpy('getDraftAccounts').and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)),
    getDraftAccountById: jasmine.createSpy('getDraftAccountById').and.returnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT)),
  };
  const mockDateService: jasmine.SpyObj<DateService> = jasmine.createSpyObj<DateService>('DateService', [
    'getDaysAgo',
    'getFromFormatToFormat',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftCheckAndManageTabsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('review'),
          },
        },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture = TestBed.createComponent(FinesDraftCheckAndManageTabsComponent);
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
    expect(mockDateService.getDaysAgo).toHaveBeenCalled();
  });

  it('should populate table data correctly', () => {
    const response = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    const tableData = component['populateTableData'](response);
    expect(tableData.length).toEqual(response.summaries.length);
    expect(tableData[0]['Defendant id']).toEqual(response.summaries[0].draft_account_id);
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

  it('should navigate to review account', () => {
    const draftAccountId = 1;
    const routerSpy = spyOn(component['router'], 'navigate');
    component.activeTab = 'review';
    component['navigateToReviewAccount'](draftAccountId);
    expect(routerSpy).toHaveBeenCalledWith([
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`,
      draftAccountId,
    ]);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(finesDraftStore.amend()).toBeFalse();
  });

  it('should navigate to review account when rejected', () => {
    const draftAccountId = 1;
    const routerSpy = spyOn(component['router'], 'navigate');
    component.activeTab = 'rejected';
    component['navigateToReviewAccount'](draftAccountId);
    expect(routerSpy).toHaveBeenCalledWith([
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`,
      draftAccountId,
    ]);

    expect(finesDraftStore.fragment()).toEqual('rejected');
    expect(finesDraftStore.amend()).toBeTrue();
  });

  it('should handle defendant click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'navigateToReviewAccount');
    component.onDefendantClick(1);
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
    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
  });

  it('should set rejectedCount$ to the count as a string', () => {
    (mockOpalFinesService.getDraftAccounts as jasmine.Spy).and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    component['getRejectedCount']();

    component.rejectedCount$.subscribe((value) => {
      expect(value).toBe('2');
    });
  });

  it('should set rejectedCount$ to "99+" if count exceeds 99', () => {
    const mockResponse = { count: 100 };
    (mockOpalFinesService.getDraftAccounts as jasmine.Spy).and.returnValue(of(mockResponse));

    component['getRejectedCount']();

    component.rejectedCount$.subscribe((value) => {
      expect(value).toBe('99+');
    });
  });

  it('should handle route navigation correctly', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const route = 'some/route';
    component.activeTab = 'review';
    component.handleRoute(route);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(routerSpy).toHaveBeenCalledWith([route], { relativeTo: component['activatedRoute'].parent });
  });
});
