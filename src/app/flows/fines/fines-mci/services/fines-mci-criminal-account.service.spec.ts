import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { catchError, defaultIfEmpty, firstValueFrom, of, Subject, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciCriminalAccountService } from './fines-mci-criminal-account.service';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';

describe('FinesMciCriminalAccountService', () => {
  let service: FinesMciCriminalAccountService;
  let store: InstanceType<typeof FinesMciStore>;
  let opalFines: {
    clearCache: ReturnType<typeof vi.fn>;
    getDefendantAccountAtAGlance: ReturnType<typeof vi.fn>;
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
  };
  const accounts = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts;

  beforeEach(() => {
    opalFines = {
      clearCache: vi.fn(),
      getDefendantAccountHeadingData: vi.fn().mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK)),
      getDefendantAccountAtAGlance: vi.fn().mockReturnValue(of(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK)),
    };
    TestBed.configureTestingModule({ providers: [{ provide: OpalFines, useValue: opalFines }] });
    service = TestBed.inject(FinesMciCriminalAccountService);
    store = TestBed.inject(FinesMciStore);
  });

  it('should invalidate the shared cache before fetching each selected account', async () => {
    for (const account of accounts.slice(0, 2)) {
      opalFines.clearCache.mockClear();
      opalFines.getDefendantAccountAtAGlance.mockClear();
      opalFines.getDefendantAccountHeadingData.mockClear();
      await firstValueFrom(service.loadSelectedAccountDetails(account));

      expect(opalFines.clearCache).toHaveBeenCalledExactlyOnceWith('defendantAccountAtAGlanceCache$');
      expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledExactlyOnceWith(account.defendant_account_id);
      expect(opalFines.getDefendantAccountHeadingData).toHaveBeenCalledExactlyOnceWith(account.defendant_account_id);
      expect(opalFines.clearCache.mock.invocationCallOrder[0]).toBeLessThan(
        opalFines.getDefendantAccountAtAGlance.mock.invocationCallOrder[0],
      );
      expect(store.selectedCriminalAccount()).toEqual(account);
      expect(store.selectedCriminalAccountAtAGlance()).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      expect(store.selectedCriminalAccountHeader()).toEqual(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    }
  });

  it('should not fetch an account without an ID', () => {
    service.loadSelectedAccountDetails({ ...accounts[0], defendant_account_id: null }).subscribe();
    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
  });

  it('should not store a late response after the search is reset', () => {
    const response = new Subject<IOpalFinesAccountDefendantAtAGlance>();
    opalFines.getDefendantAccountAtAGlance.mockReturnValue(response);
    service.loadSelectedAccountDetails(accounts[0]).subscribe();
    store.resetCriminalSearch();
    response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    response.complete();
    expect(store.selectedCriminalAccountAtAGlance()).toBeNull();
    expect(store.selectedCriminalAccountHeader()).toBeNull();
  });

  it('should wait for account status before storing details for the destination page', () => {
    const headerResponse = new Subject<typeof FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK>();
    opalFines.getDefendantAccountHeadingData.mockReturnValue(headerResponse);
    const next = vi.fn();
    service.loadSelectedAccountDetails(accounts[0]).subscribe(next);
    expect(next).not.toHaveBeenCalled();
    expect(store.selectedCriminalAccountHeader()).toBeNull();
    expect(store.selectedCriminalAccountAtAGlance()).toBeNull();

    headerResponse.next(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    headerResponse.complete();

    expect(next).toHaveBeenCalledExactlyOnceWith(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    expect(store.selectedCriminalAccountHeader()).toEqual(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
  });

  it('should not publish partial account data if the header request fails', async () => {
    opalFines.getDefendantAccountHeadingData.mockReturnValue(throwError(() => new Error('Header request failed')));
    await expect(firstValueFrom(service.loadSelectedAccountDetails(accounts[0]))).rejects.toThrow(
      'Header request failed',
    );
    expect(store.selectedCriminalAccountHeader()).toBeNull();
    expect(store.selectedCriminalAccountAtAGlance()).toBeNull();
  });
});

describe('FinesMciCriminalAccountService HTTP error handling', () => {
  let service: FinesMciCriminalAccountService;
  let httpMock: HttpTestingController;
  const isErrorBannerVisible = signal(false);
  const account = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];

  beforeEach(() => {
    isErrorBannerVisible.set(false);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        {
          provide: GlobalStore,
          useValue: {
            setBannerError: () => isErrorBannerVisible.set(true),
            resetBannerError: () => isErrorBannerVisible.set(false),
          },
        },
        { provide: AppInsightsService, useValue: { logException: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
    service = TestBed.inject(FinesMciCriminalAccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it.each([409, 500])(
    'should cancel pending at-a-glance loading and preserve the error banner when header-summary returns %s',
    (status) => {
      const next = vi.fn();
      service
        .loadSelectedAccountDetails(account)
        .pipe(
          catchError(() => of(null)),
          defaultIfEmpty(null),
        )
        .subscribe(next);

      const atAGlance = httpMock.expectOne(
        `${OPAL_FINES_PATHS.defendantAccounts}/${account.defendant_account_id}/at-a-glance`,
      );
      const header = httpMock.expectOne(
        `${OPAL_FINES_PATHS.defendantAccounts}/${account.defendant_account_id}/header-summary`,
      );
      header.flush({ retriable: true, detail: 'Try again.' }, { status, statusText: 'Request failed' });

      expect(next).toHaveBeenCalledExactlyOnceWith(null);
      expect(atAGlance.cancelled).toBe(true);
      expect(isErrorBannerVisible()).toBe(true);
      const store = TestBed.inject(FinesMciStore);
      expect(store.selectedCriminalAccountAtAGlance()).toBeNull();
      expect(store.selectedCriminalAccountHeader()).toBeNull();
    },
  );
});
