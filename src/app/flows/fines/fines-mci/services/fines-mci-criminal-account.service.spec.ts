import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciCriminalAccountService } from './fines-mci-criminal-account.service';

describe('FinesMciCriminalAccountService', () => {
  let service: FinesMciCriminalAccountService;
  let store: InstanceType<typeof FinesMciStore>;
  let opalFines: { clearCache: ReturnType<typeof vi.fn>; getDefendantAccountAtAGlance: ReturnType<typeof vi.fn> };
  const accounts = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts;

  beforeEach(() => {
    opalFines = {
      clearCache: vi.fn(),
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
      await firstValueFrom(service.loadSelectedAccountAtAGlance(account));

      expect(opalFines.clearCache).toHaveBeenCalledExactlyOnceWith('defendantAccountAtAGlanceCache$');
      expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledExactlyOnceWith(account.defendant_account_id);
      expect(opalFines.clearCache.mock.invocationCallOrder[0]).toBeLessThan(
        opalFines.getDefendantAccountAtAGlance.mock.invocationCallOrder[0],
      );
      expect(store.selectedCriminalAccount()).toEqual(account);
      expect(store.selectedCriminalAccountAtAGlance()).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    }
  });

  it('should not fetch an account without an ID', () => {
    service.loadSelectedAccountAtAGlance({ ...accounts[0], defendant_account_id: null }).subscribe();
    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
  });

  it('should not store a late response after the search is reset', () => {
    const response = new Subject<IOpalFinesAccountDefendantAtAGlance>();
    opalFines.getDefendantAccountAtAGlance.mockReturnValue(response);
    service.loadSelectedAccountAtAGlance(accounts[0]).subscribe();
    store.resetCriminalSearch();
    response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    response.complete();
    expect(store.selectedCriminalAccountAtAGlance()).toBeNull();
  });
});
