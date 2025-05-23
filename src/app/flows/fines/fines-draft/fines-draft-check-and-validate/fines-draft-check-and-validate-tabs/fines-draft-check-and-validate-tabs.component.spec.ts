import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCheckAndValidateTabsComponent } from './fines-draft-check-and-validate-tabs.component';
import { ActivatedRoute } from '@angular/router';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, take } from 'rxjs';
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

    finesDraftService = jasmine.createSpyObj<FinesDraftService>('FinesDraftService', ['populateTableData']);

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

  it('should emit expected data', (done) => {
    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'to-review');

    component.tabData$.pipe(take(1)).subscribe((result) => {
      expect(result).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
      expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
      done();
    });
  });

  it('should fetch data from service if tab is not the initialTab', (done) => {
    const nonInitialTab = 'rejected';

    const draftResponse = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);

    mockOpalFinesService.getDraftAccounts.and.returnValue(of(draftResponse));

    const route = TestBed.inject(ActivatedRoute);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).fragment = of(nonInitialTab);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).snapshot.fragment = 'to-review';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (route as any).snapshot.data = {
      draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    };

    fixture = TestBed.createComponent(FinesDraftCheckAndValidateTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.tabData$.pipe(take(1)).subscribe((data) => {
      expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
      expect(finesDraftService.populateTableData).toHaveBeenCalledWith(draftResponse);
      expect(data).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
      done();
    });
  });
});
