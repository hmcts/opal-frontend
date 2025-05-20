import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCheckAndValidateTabsComponent } from './fines-draft-check-and-validate-tabs.component';
import { ActivatedRoute } from '@angular/router';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FinesDraftService } from '../../services/fines-draft.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';

describe('FinesDraftCheckAndValidateTabsComponent', () => {
  let component: FinesDraftCheckAndValidateTabsComponent;
  let fixture: ComponentFixture<FinesDraftCheckAndValidateTabsComponent>;
  let globalStore: GlobalStoreType;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let activatedRoute: ActivatedRoute;
  let finesDraftService: jasmine.SpyObj<FinesDraftService>;

  beforeEach(async () => {
    const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
      jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);

    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDraftAccounts']);
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    finesDraftService = jasmine.createSpyObj<FinesDraftService>('FinesDraftService', [
      'createTabDataStream',
      'handleTabSwitch',
    ]);

    const mockDateService: jasmine.SpyObj<DateService> = jasmine.createSpyObj<DateService>('DateService', [
      'getDaysAgo',
      'getFromFormatToFormat',
    ]);

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
            fragment: of('review'),
            snapshot: {
              data: {
                draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
              },
              fragment: 'to-review',
            },
          },
        },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state when fragment is null', () => {
    activatedRoute.snapshot.fragment = null;
    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupTabDataStream').and.callThrough();

    fixture.detectChanges();
    component.ngOnInit();

    expect(component['setupTabDataStream']).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'to-review');
  });

  it('should assign tabData$ observable from finesDraftService.createTabDataStream', () => {
    const mockTabData$ = of(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    finesDraftService.createTabDataStream.and.returnValue(mockTabData$);

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'to-review');

    expect(component.tabData$).toBe(mockTabData$);
    expect(finesDraftService.createTabDataStream).toHaveBeenCalled();
  });

  it('should call createTabDataStream with correct parameters and assign tabData$', () => {
    const mockTabData$ = of(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    const initialTab = 'to-review';
    finesDraftService.createTabDataStream.and.returnValue(mockTabData$);

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, initialTab);

    expect(component.tabData$).toBe(mockTabData$);
    expect(finesDraftService.createTabDataStream).toHaveBeenCalledWith(
      OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      initialTab,
      jasmine.any(Object),
      jasmine.any(Function),
    );

    const paramsFn = finesDraftService.createTabDataStream.calls.mostRecent().args[3];
    const result = paramsFn(initialTab);
    expect(result).toEqual({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: jasmine.any(Array),
      notSubmittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
    });
  });

  it('should process fragment$ correctly and update activeTab via tap', () => {
    const mockTabData$ = of(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    const initialTab = 'to-review';

    finesDraftService.createTabDataStream.and.callFake((_initialData, _initialTab, fragment$, getParams) => {
      fragment$.subscribe();

      const result = getParams('to-review');
      expect(result).toEqual({
        businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
        statuses: jasmine.any(Array),
        notSubmittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
      });

      return mockTabData$;
    });

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, initialTab);

    expect(finesDraftService.createTabDataStream).toHaveBeenCalled();
  });
});
