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
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';

describe('FinesDraftCheckAndManageTabsComponent', () => {
  let component: FinesDraftCheckAndManageTabsComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndManageTabsComponent>;
  let globalStore: GlobalStoreType;
  let finesDraftStore: FinesDraftStoreType;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let routerEventSubject: Subject<NavigationEnd>;
  let mockRouter: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let finesDraftService: jasmine.SpyObj<FinesDraftService>;

  beforeEach(async () => {
    const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
      jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);

    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDraftAccounts', 'getDraftAccountById']);
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT));

    finesDraftService = jasmine.createSpyObj<FinesDraftService>('FinesDraftService', [
      'onDefendantClick',
      'populateTableData',
    ]);

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
        { provide: FinesDraftService, useValue: finesDraftService },
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
    finesDraftService.populateTableData.and.returnValue([]);
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
    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
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

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
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

  it('should call setFragmentAndAmend and onDefendantClick with PATH_REVIEW_ACCOUNT when activeTab is not "rejected"', () => {
    component.activeTab = 'review';
    component.onDefendantClick(123);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(finesDraftStore.amend()).toBeFalsy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(123, component.PATH_REVIEW_ACCOUNT);
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_AMEND_ACCOUNT when activeTab is "rejected"', () => {
    component.activeTab = 'rejected';
    component.onDefendantClick(456);
    expect(finesDraftStore.fragment()).toEqual('rejected');
    expect(finesDraftStore.amend()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(456, component.PATH_AMEND_ACCOUNT);
  });
});
