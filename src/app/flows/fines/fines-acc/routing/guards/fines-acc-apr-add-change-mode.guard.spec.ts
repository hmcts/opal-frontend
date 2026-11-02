import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { finesAccAprResolver } from '../resolvers/fines-acc-apr/fines-acc-apr.resolver';
import { finesAccAprAddChangeModeGuard } from './fines-acc-apr-add-change-mode.guard';

@Component({ template: '' })
class ModeGuardTestPage {}

describe('finesAccAprAddChangeModeGuard', () => {
  const aprRoot = '/fines/account/defendant/141/alternate/payment/reference';
  const reference: IOpalFinesApr = {
    alternate_payment_reference_id: 11,
    defendant_account_id: 141,
    business_unit_id: 77,
    relationship: 'APR',
    category: 'APR',
    apr_text: 'TEST-REFERENCE',
    created_at: '2026-06-01T12:00:00Z',
    updated_at: null,
  };
  let api: {
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
    getAprs: ReturnType<typeof vi.fn>;
  };
  let accountStore: { setAccountState: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = {
      getDefendantAccountHeadingData: vi.fn().mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK)),
      getAprs: vi.fn().mockReturnValue(of({ references: [], version: '"7"' })),
    };
    accountStore = { setAccountState: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference',
            children: [
              { path: 'manage', component: ModeGuardTestPage },
              {
                path: ':mode',
                component: ModeGuardTestPage,
                canActivate: [finesAccAprAddChangeModeGuard],
                resolve: { aprs: finesAccAprResolver },
              },
            ],
          },
        ]),
        { provide: OpalFines, useValue: api },
        { provide: FinesAccountStore, useValue: accountStore },
        {
          provide: FinesAccPayloadService,
          useValue: { transformDefendantAccountHeaderForStore: vi.fn().mockReturnValue(MOCK_FINES_ACCOUNT_STATE) },
        },
      ],
    });
  });

  it.each(['add'])('allows mode %s to load fresh APR data', async (mode) => {
    api.getAprs.mockReturnValue(of({ references: mode === 'change' ? [reference] : [], version: '"7"' }));
    const harness = await RouterTestingHarness.create();
    const destination = `${aprRoot}/${mode}?alternatePaymentReferenceId=11`;

    await harness.navigateByUrl(destination);

    expect(TestBed.inject(Router).url).toBe(destination);
    expect(api.getDefendantAccountHeadingData).toHaveBeenCalledExactlyOnceWith(141);
    expect(api.getAprs).toHaveBeenCalledExactlyOnceWith(141);
  });

  it.each([
    { mode: 'change', accountId: 141 },
    { mode: 'edit', accountId: 141 },
    { mode: 'unknown', accountId: 142 },
    { mode: 'ADD', accountId: 141 },
    { mode: 'Change', accountId: 142 },
  ])(
    'redirects invalid mode $mode to account $accountId Manage before any API request',
    async ({ mode, accountId }) => {
      const harness = await RouterTestingHarness.create();
      const accountRoot = `/fines/account/defendant/${accountId}/alternate/payment/reference`;

      await harness.navigateByUrl(`${accountRoot}/${mode}?alternatePaymentReferenceId=11#payment-reference`);

      expect(TestBed.inject(Router).url).toBe(`${accountRoot}/manage`);
      expect(api.getDefendantAccountHeadingData).not.toHaveBeenCalled();
      expect(api.getAprs).not.toHaveBeenCalled();
      expect(accountStore.setAccountState).not.toHaveBeenCalled();
    },
  );
});
