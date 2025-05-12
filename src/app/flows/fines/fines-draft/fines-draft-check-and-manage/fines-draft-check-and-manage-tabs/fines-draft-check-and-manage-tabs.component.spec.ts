import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCheckAndManageTabsComponent } from './fines-draft-check-and-manage-tabs.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of, firstValueFrom, Subject } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let routerEventSubject: Subject<NavigationEnd>;
  let mockRouter: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
      jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);

    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDraftAccounts', 'getDraftAccountById']);
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT));

    const mockDateService: jasmine.SpyObj<DateService> = jasmine.createSpyObj<DateService>('DateService', [
      'getDaysAgo',
      'getFromFormatToFormat',
    ]);

    routerEventSubject = new Subject<NavigationEnd>();
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: routerEventSubject.asObservable() });

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
            snapshot: {
              data: {
                draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
                rejectedCount: 2,
              },
              fragment: 'review',
            },
          },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture = TestBed.createComponent(FinesDraftCheckAndManageTabsComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate table data correctly', () => {
    const response = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    const tableData = component['populateTableData'](response);
    expect(tableData.length).toEqual(response.summaries.length);
    expect(tableData[0]['Defendant id']).toEqual(response.summaries[0].draft_account_id);
  });

  it('should navigate to review account', () => {
    const draftAccountId = 1;
    component.activeTab = 'review';
    component['navigateToReviewAccount'](draftAccountId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`,
      draftAccountId,
    ]);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(finesDraftStore.amend()).toBeFalse();
  });

  it('should navigate to review account when rejected', () => {
    const draftAccountId = 1;
    component.activeTab = 'rejected';
    component['navigateToReviewAccount'](draftAccountId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
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

  it('should handle tab switch', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'handleTabSwitch').and.callThrough();
    component.handleTabSwitch('review');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).handleTabSwitch).toHaveBeenCalledWith('review');
  });

  it('should initialize with default state', () => {
    component.ngOnInit();
    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
  });

  it('should initialize with default state when fragment is null', () => {
    activatedRoute.snapshot.fragment = null;
    fixture = TestBed.createComponent(FinesDraftCheckAndManageTabsComponent);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupTabDataStream').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupRejectedCountStream').and.callThrough();

    fixture.detectChanges();
    component.ngOnInit();

    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
    expect(component['setupTabDataStream']).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'review');
    expect(component['setupRejectedCountStream']).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count, 'review');
  });

  it('should handle route navigation correctly', () => {
    const route = 'some/route';
    component.activeTab = 'review';
    component.handleRoute(route);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(mockRouter.navigate).toHaveBeenCalledWith([route], { relativeTo: component['activatedRoute'].parent });
  });

  it('should use default values when resolver data is empty', async () => {
    activatedRoute.snapshot.data = {
      draftAccounts: { count: 0, summaries: [] },
      rejectedCount: 0,
    };
    fixture = TestBed.createComponent(FinesDraftCheckAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const tabData = await firstValueFrom(component.tabData$);
    expect(tabData).toEqual([]);
    const rejectedCount = await firstValueFrom(component.rejectedCount$);
    expect(rejectedCount).toBe('0');
  });

  it('should display "99+" when rejectedCount is 100 in resolver data', async () => {
    activatedRoute.snapshot.data = {
      draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      rejectedCount: 100,
    };
    fixture = TestBed.createComponent(FinesDraftCheckAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const rejectedCount = await firstValueFrom(component.rejectedCount$);
    expect(rejectedCount).toBe('99+');
  });

  it('should fetch tab data via API in setupTabDataStream when fragment does not match initial tab', async () => {
    activatedRoute.fragment = of('rejected');
    activatedRoute.snapshot.data = {
      draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      rejectedCount: 2,
    };

    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    fixture = TestBed.createComponent(FinesDraftCheckAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.activeTab = 'review';

    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();

    const expected = component['populateTableData'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
    expect(tabData).toEqual(expected);
  });

  it('should update rejected count on tab change with count over threshold and call formatCount', async () => {
    const largeRejectedCountResponse = { count: 150, summaries: [] };
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(largeRejectedCountResponse));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'formatCount').and.callThrough();

    component.activeTab = 'review';

    // Update the fragment in the snapshot to simulate tab change to 'rejected'
    activatedRoute.snapshot.fragment = 'rejected';

    // Emit a navigation end event to simulate router navigation
    routerEventSubject.next(new NavigationEnd(1, '/some-url', '/some-url'));

    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
    expect(component['formatCount']).toHaveBeenCalledWith(largeRejectedCountResponse.count);
  });

  it('should update rejected count on tab change with count over threshold and call formatCount', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'formatCount').and.callThrough();

    // Update the fragment in the snapshot
    activatedRoute.snapshot.fragment = null;

    // Emit a navigation end event to simulate router navigation
    routerEventSubject.next(new NavigationEnd(1, '/some-url', '/some-url'));

    expect(mockOpalFinesService.getDraftAccounts).not.toHaveBeenCalled();
    expect(component['formatCount']).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count);
  });
});
