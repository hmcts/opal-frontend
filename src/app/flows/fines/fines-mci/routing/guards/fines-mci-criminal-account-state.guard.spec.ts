import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlSegment } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { finesMciCriminalAccountStateGuard } from './fines-mci-criminal-account-state.guard';

describe('finesMciCriminalAccountStateGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it.each([
    ['9007199254740993', true],
    ['9007199254740992', false],
    [null, false],
  ] as const)(
    'checks the selected account %s against the routed account without changing drafts',
    (accountId, allowed) => {
      const store = TestBed.inject(FinesMciStore);
      if (accountId) {
        store.setSelectedCriminalAccount({
          ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
          defendant_account_id: accountId,
        });
      }
      store.setDraftJourney('suspense');
      const route = { path: 'account/:accountId/:type' };
      const segments = ['account', '9007199254740993', 'individual'].map((path) => new UrlSegment(path, {}));
      const result = TestBed.runInInjectionContext(() => finesMciCriminalAccountStateGuard(route, segments));
      if (allowed) {
        expect(result).toBe(true);
      } else {
        expect(result).toEqual(TestBed.inject(Router).parseUrl('/fines/manual-cash-input/create/till/details'));
      }
      expect(store.draftJourney()).toBe('suspense');
      expect(store.selectedCriminalAccount()?.defendant_account_id ?? null).toBe(accountId);
    },
  );
});
