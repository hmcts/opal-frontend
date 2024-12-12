import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCamInputterComponent } from './fines-draft-cam-inputter.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of } from 'rxjs';
import { DateService } from '@services/date-service/date.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_DRAFT_TAB_OPTIONS } from '../../constants/fines-draft-tab-options.constant';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';

describe('FinesDraftCamInputterComponent', () => {
  let component: FinesDraftCamInputterComponent;
  let fixture: ComponentFixture<FinesDraftCamInputterComponent>;
  let mockGlobalStateService: GlobalStateService;
  const mockOpalFinesService: Partial<OpalFines> = {
    getDraftAccounts: jasmine.createSpy('getDraftAccounts').and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)),
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
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('#review'),
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

  it('should initialize with the correct tab options', () => {
    expect(component.tabOptions).toEqual(FINES_DRAFT_TAB_OPTIONS.filter((option) => option.inputter === true));
  });

  it('should set the active tab option to the first tab option', () => {
    expect(component.activeTabOption).toEqual(component.tabOptions[0]);
  });

  it('should fetch draft accounts data on initialization', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'getDraftAccountsData');
    component.ngOnInit();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).getDraftAccountsData).toHaveBeenCalled();
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalled();
    expect(mockDateService.getFromFormatToFormat).toHaveBeenCalled();
    expect(mockDateService.getDaysAgoString).toHaveBeenCalled();
  });

  it('should switch tab and fetch draft accounts data', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'getDraftAccountsData');
    const fragment = component.tabOptions[1].fragment;
    component.handleTabSwitch(fragment);
    expect(component.activeTabOption.fragment).toEqual(fragment);
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
    const statuses = FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === component.activeTabOption?.fragment)?.statuses;
    const params = { businessUnitIds: component['businessUnitIds'], statuses };
    component['getDraftAccountsData']();
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith(params);
  });
});
