import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCheckAndValidateTabsComponent } from './fines-draft-check-and-validate-tabs.component';
import { ActivatedRoute } from '@angular/router';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, of, Subject, take } from 'rxjs';
import { FinesDraftService } from '../../services/fines-draft.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FINES_DRAFT_TAB_FRAGMENT } from '../../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../../constants/fines-draft-route-data-keys.constant';

describe('FinesDraftCheckAndValidateTabsComponent', () => {
  let component: FinesDraftCheckAndValidateTabsComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndValidateTabsComponent>;
  let globalStore: GlobalStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finesDraftService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesMacPayloadService: any;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    mockFinesMacPayloadService = {
      mapAccountPayload: vi.fn().mockName('FinesMacPayloadService.mapAccountPayload'),
    };

    mockOpalFinesService = {
      getDraftAccounts: vi.fn().mockName('OpalFines.getDraftAccounts'),
      clearCache: vi.fn().mockName('OpalFines.clearCache'),
    };
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    finesDraftService = {
      onDefendantClick: vi.fn().mockName('FinesDraftService.onDefendantClick'),
      populateTableData: vi.fn().mockName('FinesDraftService.populateTableData'),
    };

    mockDateService = {
      getDaysAgo: vi.fn().mockName('DateService.getDaysAgo'),
      getFromFormatToFormat: vi.fn().mockName('DateService.getFromFormatToFormat'),
      getDateRange: vi.fn().mockName('DateService.getDateRange'),
    };
    mockDateService.getDateRange.mockReturnValue({
      from: '2023-01-01',
      to: '2023-01-07',
    });

    await TestBed.configureTestingModule({
      imports: [FinesDraftCheckAndValidateTabsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: FinesDraftService, useValue: finesDraftService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of(FINES_DRAFT_TAB_FRAGMENT.toReview),
            snapshot: {
              fragment: FINES_DRAFT_TAB_FRAGMENT.toReview,
              data: {},
            },
          },
        },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(OPAL_USER_STATE_MOCK);
    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and populate tabData$ based on the current fragment', async () => {
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.tabData$.pipe(take(1)).subscribe((data) => {
      expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
      expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
      expect(data).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    });
  });

  it('should use resolved tab data and failed count on initial load without extra API calls', async () => {
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    component.activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.toReview);
    component.activatedRoute.snapshot.fragment = FINES_DRAFT_TAB_FRAGMENT.toReview;
    component.activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      [FINES_DRAFT_ROUTE_DATA_KEYS.failedCount]: 100,
    };

    mockOpalFinesService.getDraftAccounts.mockClear();

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    const failedCount = await firstValueFrom(component.failedCount$);

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    expect(failedCount).toBe('99+');
    expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
    expect(mockOpalFinesService.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should fetch only the selected tab data on tab change', () => {
    const fragmentSubject = new Subject<string | null>();
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    component.activatedRoute.fragment = fragmentSubject.asObservable();
    component.activatedRoute.snapshot.fragment = FINES_DRAFT_TAB_FRAGMENT.toReview;
    component.activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      [FINES_DRAFT_ROUTE_DATA_KEYS.failedCount]: 2,
    };

    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccounts.mockClear();
    mockOpalFinesService.clearCache.mockClear();

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const subscription = component.tabData$.subscribe();
    const countSubscription = component.failedCount$.subscribe();
    mockOpalFinesService.getDraftAccounts.mockClear();

    fragmentSubject.next(FINES_DRAFT_TAB_FRAGMENT.failed);

    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
      notSubmittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
    expect(mockOpalFinesService.clearCache).not.toHaveBeenCalled();

    subscription.unsubscribe();
    countSubscription.unsubscribe();
  });

  it('should pass additional params for historicWindowInDays if set on this tab', async () => {
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    component.activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.deleted);
    component.activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    };

    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted],
      notSubmittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
      accountStatusDateFrom: ['2023-01-01'],
      accountStatusDateTo: ['2023-01-07'],
    });

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should test onDefendantClick and set fragment and checker and call onDefendantClick with PATH_REVIEW_ACCOUNT when activeTab is "to-review"', () => {
    component.activeTab = FINES_DRAFT_TAB_FRAGMENT.toReview;

    component.onDefendantClick(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]);

    expect(finesDraftStore.fragment()).toEqual(FINES_DRAFT_TAB_FRAGMENT.toReview);
    expect(finesDraftStore.checker()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(
      FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]['Defendant id'],
      finesDraftService.PATH_REVIEW_ACCOUNT,
    );
  });

  it('should show "0" when getDraftAccounts returns count 0', async () => {
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of({ count: 0, summaries: [] }));
    finesDraftService.populateTableData.mockReturnValue([]);

    component.ngOnInit();

    const failedCount = await firstValueFrom(component.failedCount$);
    expect(failedCount).toBe('0');

    const tabData = await firstValueFrom(component.tabData$);
    expect(tabData).toEqual([]);
  });

  it('should display "99+" when getDraftAccounts returns count >= 100', async () => {
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of({ count: 100, summaries: [] }));

    component.ngOnInit();

    const failedCount = await firstValueFrom(component.failedCount$);
    expect(failedCount).toBe('99+');
  });

  it('should route to account details page onAccountClick', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'], 'navigate');
    const accountId = 77;
    component.onAccountClick(accountId);
    expect(component['router'].navigate).toHaveBeenCalledWith([
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.children.defendant,
      accountId,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ]);
  });
});
