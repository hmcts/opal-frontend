import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCreateAndManageTabsComponent } from './fines-draft-create-and-manage-tabs.component';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of, Subject, take } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

describe('FinesDraftCreateAndManageTabsComponent', () => {
  let component: FinesDraftCreateAndManageTabsComponent;
  let fixture: ComponentFixture<FinesDraftCreateAndManageTabsComponent>;
  let globalStore: GlobalStoreType;
  let finesDraftStore: FinesDraftStoreType;
  let routerEventSubject: Subject<NavigationEnd>;
  let mockRouter: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let finesDraftService: jasmine.SpyObj<FinesDraftService>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(async () => {
    const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
      jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);

    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDraftAccounts']);
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

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

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    component.ngOnInit();
    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
  });

  it('should initialize with default state when fragment is null', () => {
    activatedRoute.snapshot.fragment = null;
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
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

  it('should call setupTabDataStream with correct arguments on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = spyOn<any>(component, 'setupTabDataStream').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'review');
  });

  it('should call setupRejectedCountStream with correct arguments on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = spyOn<any>(component, 'setupRejectedCountStream').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(2, 'review');
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const destroySpy = spyOn<any>(component['destroy$'], 'next').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completeSpy = spyOn<any>(component['destroy$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should fetch data from service if tab is not the initialTab', (done) => {
    const nonInitialTab = 'rejected';
    const initialTab = 'review';

    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);

    const route = TestBed.inject(ActivatedRoute);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).fragment = of(nonInitialTab);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).snapshot.fragment = initialTab;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).snapshot.data = {
      draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      rejectedCount: 2,
    };

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.tabData$.pipe(take(1)).subscribe((data) => {
      expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
      expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
      expect(data).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
      done();
    });
  });

  it('should use resolverRejectedCount if tab matches initialTab', (done) => {
    const resolverRejectedCount = 5;
    const initialTab = 'review';

    component['setupRejectedCountStream'](resolverRejectedCount, initialTab);

    component.rejectedCount$.pipe(take(1)).subscribe((result) => {
      expect(result).toBe('5');
      done();
    });
  });

  it('should fetch and format rejected count if tab does not match initialTab', (done) => {
    const initialTab = 'review';
    const simulatedTab = 'rejected';
    activatedRoute.snapshot.fragment = simulatedTab;

    mockOpalFinesService.getDraftAccounts.and.returnValue(
      of({ ...structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK), count: 150 }),
    );

    component['setupRejectedCountStream'](150, initialTab);

    const navEvent = new NavigationEnd(1, '/from', '/to');
    routerEventSubject.next(navEvent);

    component.rejectedCount$.pipe(take(1)).subscribe((count) => {
      expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
      expect(count).toBe('99+');
      done();
    });
  });

  it('should fallback to "review" if snapshot.fragment is falsy', (done) => {
    activatedRoute.snapshot.fragment = null;

    const navEvent = new NavigationEnd(1, '/prev', '/curr');
    routerEventSubject.next(navEvent);

    component['setupRejectedCountStream'](2, 'review');

    component.rejectedCount$.pipe(take(1)).subscribe((count) => {
      expect(count).toBe('2');
      done();
    });
  });
});
