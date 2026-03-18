import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FinesConSearchResultComponent } from './fines-con-search-result.component';
import { IFinesConSearchResultDefendantAccount } from './interfaces/fines-con-search-result-defendant-account.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, Subject } from 'rxjs';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from './mocks/fines-con-search-result-defendant-accounts-formatting.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FALSEY_VALUES_MOCK } from './mocks/fines-con-search-result-defendant-accounts-falsey-values.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_WITH_CHECKS_MOCK } from './mocks/fines-con-search-result-defendant-accounts-with-checks.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_RESPONSE_MOCK } from './mocks/fines-con-search-result-defendant-accounts-response.mock';

describe('FinesConSearchResultComponent', () => {
  let component: FinesConSearchResultComponent;
  let fixture: ComponentFixture<FinesConSearchResultComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let router: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let opalFines: any;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesConSearchResultComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            createUrlTree: vi.fn().mockName('Router.createUrlTree'),
            serializeUrl: vi.fn().mockName('Router.serializeUrl'),
          },
        },
        {
          provide: OpalFines,
          useValue: {
            getDefendantAccounts: vi.fn().mockName('OpalFines.getDefendantAccounts'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchResultComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router = TestBed.inject(Router) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opalFines = TestBed.inject(OpalFines) as any;
    finesConStore = TestBed.inject(FinesConStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map defendant accounts with required formatting', () => {
    const defendantAccounts: IFinesConSearchResultDefendantAccount[] =
      FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK;

    component.defendantAccounts = defendantAccounts;

    expect(component.tableData).toEqual([
      expect.objectContaining({
        'Account ID': 11,
        Account: 'ACC001',
        Name: 'SMITH, John James',
        Aliases: 'ADAMS, Amy\nBAKER, Ben',
        'Date of birth': '1990-01-03',
        'Address line 1': '1 Main Street',
        Postcode: 'AB1 2CD',
        CO: 'Y',
        ENF: 'distress',
        Balance: 120.5,
        'P/G': '-',
        'NI number': 'QQ123456C',
        Ref: 'REF-1',
      }),
    ]);

    expect(component.checksByAccountId[11]).toEqual([
      {
        reference: 'CON.ER.4',
        severity: 'error',
        message: 'Account has days in default',
      },
    ]);
  });

  it('should default CO and P/G to hyphen when values are falsey', () => {
    const defendantAccounts: IFinesConSearchResultDefendantAccount[] =
      FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FALSEY_VALUES_MOCK;

    component.defendantAccounts = defendantAccounts;

    expect(component.tableData[0]['CO']).toBe('-');
    expect(component.tableData[0]['P/G']).toBe('-');
  });

  it('should open account details in a new tab', () => {
    const mockUrl = '/fines/account/11/details';
    router.serializeUrl.mockReturnValue(mockUrl);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(globalThis, 'open');

    component.onAccountIdClick(11);

    expect(router.createUrlTree).toHaveBeenCalled();
    expect(router.serializeUrl).toHaveBeenCalled();
    expect(globalThis.open).toHaveBeenCalledWith(mockUrl, '_blank');
  });

  it('should fetch and map defendant accounts when searchPayload is provided', () => {
    const updateResultsSpy = vi.spyOn(finesConStore, 'updateDefendantResults');
    const defendantAccounts: IFinesConSearchResultDefendantAccount[] =
      FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK;
    opalFines.getDefendantAccounts.mockReturnValue(of(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_RESPONSE_MOCK));

    component.defendantType = 'individual';
    component.searchPayload = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      consolidation_search: false,
    };

    expect(opalFines.getDefendantAccounts).toHaveBeenCalledWith(
      expect.objectContaining({ consolidation_search: true }),
    );
    expect(component.tableData.length).toBe(1);
    expect(updateResultsSpy).toHaveBeenCalledWith(defendantAccounts, []);
  });

  it('should update company results bucket when searchPayload is provided for company defendant type', () => {
    const updateResultsSpy = vi.spyOn(finesConStore, 'updateDefendantResults');
    const defendantAccounts: IFinesConSearchResultDefendantAccount[] =
      FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK;
    opalFines.getDefendantAccounts.mockReturnValue(of(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_RESPONSE_MOCK));

    component.defendantType = 'company';
    component.searchPayload = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      consolidation_search: false,
    };

    expect(updateResultsSpy).toHaveBeenCalledWith([], defendantAccounts);
  });

  it('should hydrate results from individual store bucket when searchPayload is null', () => {
    finesConStore.updateDefendantResults(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK, []);
    component.defendantType = 'individual';

    component.searchPayload = null;

    expect(opalFines.getDefendantAccounts).not.toHaveBeenCalled();
    expect(component.tableData[0]).toEqual(
      expect.objectContaining({
        'Account ID': 11,
        Account: 'ACC001',
      }),
    );
  });

  it('should hydrate results from company store bucket when searchPayload is null', () => {
    finesConStore.updateDefendantResults([], FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FALSEY_VALUES_MOCK);
    component.defendantType = 'company';

    component.searchPayload = null;

    expect(opalFines.getDefendantAccounts).not.toHaveBeenCalled();
    expect(component.tableData[0]).toEqual(
      expect.objectContaining({
        'Account ID': 12,
        Account: 'ACC002',
      }),
    );
  });

  it('should map checks from errors and warnings arrays', () => {
    const defendantAccounts: IFinesConSearchResultDefendantAccount[] =
      FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_WITH_CHECKS_MOCK;

    component.defendantAccounts = defendantAccounts;

    expect(component.checksByAccountId[99000000000020]).toEqual([
      { reference: 'CON.ER.1', severity: 'error', message: 'Account status is `CS`' },
      { reference: 'CON.WN.2', severity: 'warning', message: 'Account has uncleared cheque payments' },
    ]);
  });

  it('should map checks when account id is provided in camelCase', () => {
    component.defendantAccounts = [
      {
        defendantAccountId: 12345,
        checks: {
          errors: [{ reference: 'CON.ER.9', message: 'Blocked account' }],
        },
      } as unknown as IFinesConSearchResultDefendantAccount,
    ];

    expect(component.checksByAccountId[12345]).toEqual([
      { reference: 'CON.ER.9', severity: 'error', message: 'Blocked account' },
    ]);
  });

  it('should log and not display results when more than 100 results are provided', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const defendantAccounts = Array.from({ length: 101 }, (_, index) => ({
      defendant_account_id: index + 1,
      account_number: `ACC-${index + 1}`,
      defendant_surname: `SURNAME_${index + 1}`,
      defendant_firstnames: `FORENAME_${index + 1}`,
    })) as unknown as IFinesConSearchResultDefendantAccount[];

    component.defendantAccounts = defendantAccounts;

    expect(component.tableData).toHaveLength(0);
    expect(component.defendantAccountsData).toHaveLength(0);
    expect(component.checksByAccountId).toEqual({});
    expect(logSpy).toHaveBeenCalledWith('more than 100 results');
  });

  it('should ignore stale in-flight response when a newer search is triggered', () => {
    const oldResponse$ = new Subject<unknown>();
    const newResponse$ = new Subject<unknown>();

    opalFines.getDefendantAccounts.mockReturnValueOnce(oldResponse$).mockReturnValueOnce(newResponse$);

    component.defendantType = 'individual';

    component.searchPayload = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      consolidation_search: false,
    };

    component.searchPayload = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      consolidation_search: false,
    };

    newResponse$.next(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_RESPONSE_MOCK);
    newResponse$.complete();

    oldResponse$.next({
      defendant_accounts: [
        {
          defendant_account_id: 999,
          account_number: 'STALE',
          defendant_surname: 'Stale',
        },
      ],
    });
    oldResponse$.complete();

    expect(component.tableData).toEqual([
      expect.objectContaining({
        'Account ID': 11,
        Account: 'ACC001',
      }),
    ]);
  });
});
