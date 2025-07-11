import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCreateAndManageTabsComponent } from './fines-draft-create-and-manage-tabs.component';
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
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_APPROVED,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort.constants';

describe('FinesDraftCreateAndManageTabsComponent', () => {
  let component: FinesDraftCreateAndManageTabsComponent;
  let fixture: ComponentFixture<FinesDraftCreateAndManageTabsComponent>;
  let globalStore: GlobalStoreType;
  let finesDraftStore: FinesDraftStoreType;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let routerEventSubject: Subject<NavigationEnd>;
  let mockRouter: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let finesDraftService: jasmine.SpyObj<FinesDraftService>;
  let mockDateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
      jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);

    mockOpalFinesService = jasmine.createSpyObj('OpalFines', [
      'getDraftAccounts',
      'getDraftAccountById',
      'clearDraftAccountsCache',
    ]);
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccountById.and.returnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT));

    finesDraftService = jasmine.createSpyObj<FinesDraftService>('FinesDraftService', [
      'onDefendantClick',
      'populateTableData',
    ]);

    mockDateService = jasmine.createSpyObj<DateService>('DateService', [
      'getDaysAgo',
      'getFromFormatToFormat',
      'getDateRange',
    ]);

    routerEventSubject = new Subject<NavigationEnd>();
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: routerEventSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [FinesDraftCreateAndManageTabsComponent],
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

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
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

  it('should initialise tab data using default fragment when fragment is null', async () => {
    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);

    activatedRoute.snapshot.fragment = null;
    activatedRoute.fragment = of(null); // simulate fallback to default

    component.ngOnInit();

    const result = await firstValueFrom(component.tabData$);

    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
    expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
    expect(result).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should handle route navigation correctly', () => {
    const route = 'some/route';
    component.activeTab = 'review';
    component.handleRoute(route);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(mockRouter.navigate).toHaveBeenCalledWith([route], { relativeTo: component['activatedRoute'].parent });
  });

  it('should show "0" when getDraftAccounts returns count 0', async () => {
    mockOpalFinesService.getDraftAccounts.and.returnValue(of({ count: 0, summaries: [] }));
    finesDraftService.populateTableData.and.returnValue([]);

    component.ngOnInit();

    const rejectedCount = await firstValueFrom(component.rejectedCount$);
    expect(rejectedCount).toBe('0');

    const tabData = await firstValueFrom(component.tabData$);
    expect(tabData).toEqual([]);
  });

  it('should display "99+" when getDraftAccounts returns count >= 100', async () => {
    mockOpalFinesService.getDraftAccounts.and.returnValue(of({ count: 100, summaries: [] }));

    component.ngOnInit();

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

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.activeTab = 'review';

    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_REVIEW_ACCOUNT when activeTab is not "rejected"', () => {
    component.activeTab = 'review';
    component.onDefendantClick(123);
    expect(finesDraftStore.fragment()).toEqual('review');
    expect(finesDraftStore.amend()).toBeFalsy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(123, finesDraftService.PATH_REVIEW_ACCOUNT);
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_AMEND_ACCOUNT when activeTab is "rejected"', () => {
    component.activeTab = 'rejected';
    component.onDefendantClick(456);
    expect(finesDraftStore.fragment()).toEqual('rejected');
    expect(finesDraftStore.amend()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(456, finesDraftService.PATH_AMEND_ACCOUNT);
  });

  it('should pass additional params for historicWindowInDays if set on this tab', async () => {
    mockDateService.getDateRange.and.returnValue({
      from: '2023-01-01',
      to: '2023-01-07',
    });
    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    activatedRoute.fragment = of('deleted');
    activatedRoute.snapshot.data = {
      draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      deletedCount: 2,
    };

    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: ['Deleted'],
      submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
      accountStatusDateFrom: ['2023-01-01'],
      accountStatusDateTo: ['2023-01-07'],
    });

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should route to account details page onAccountClick', () => {
    const accountNumber = 'ACC123';
    component.onAccountClick(accountNumber);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      accountNumber,
      FINES_ACC_ROUTING_PATHS.children.details,
    ]);
  });

  it('should use the relevant table sorting based when the active tab is APPROVED', () => {
    activatedRoute.fragment = of('approved');
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.tableSort).toEqual(FINES_DRAFT_TABLE_WRAPPER_SORT_APPROVED);
  });

  it('should use the relevant table sorting based when the active tab is DELETED', () => {
    activatedRoute.fragment = of('deleted');
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.tableSort).toEqual(FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED);
  });

  it('should use the relevant table sorting based when the active tab is IN REVIEW', () => {
    activatedRoute.fragment = of('in review');
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.tableSort).toEqual(FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT);
  });
});
