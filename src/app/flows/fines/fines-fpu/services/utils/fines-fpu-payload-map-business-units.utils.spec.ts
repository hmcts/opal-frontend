import { describe, expect, it } from 'vitest';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import {
  FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK,
  FINES_FPU_PAYLOAD_USER_STATE_MOCK,
} from '../mocks/fines-fpu-payload.mock';
import { mapFinesFpuDraftAccountsToBusinessUnits } from './fines-fpu-payload-map-business-units.utils';

describe('mapFinesFpuDraftAccountsToBusinessUnits', () => {
  it('counts all returned uploads per business unit and sorts names alphabetically', () => {
    const summary = structuredClone(FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK);
    const response: IOpalFinesDraftAccountsResponse = {
      count: 3,
      summaries: [
        summary,
        {
          ...summary,
          draft_account_id: 102,
          business_unit_id: 12,
          account_snapshot: { ...summary.account_snapshot, business_unit_name: 'Ashford' },
        },
        {
          ...summary,
          draft_account_id: 103,
          created_at: '2026-02-01T10:00:00Z',
          submitted_by: 'another-uploader',
          account_status_date: '2026-02-01T10:00:00Z',
          account_snapshot: {
            ...summary.account_snapshot,
            created_date: '2026-02-01',
            submitted_by: 'another-uploader',
          },
        },
      ],
    };
    const originalResponse = structuredClone(response);
    const originalUserState = structuredClone(FINES_FPU_PAYLOAD_USER_STATE_MOCK);

    expect(mapFinesFpuDraftAccountsToBusinessUnits(response, FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual([
      { business_unit_id: 12, business_unit_name: 'Ashford', ticket_count: 1 },
      { business_unit_id: 78, business_unit_name: 'Zedford', ticket_count: 2 },
    ]);
    expect(response).toEqual(originalResponse);
    expect(FINES_FPU_PAYLOAD_USER_STATE_MOCK).toEqual(originalUserState);
  });

  it('does not expose business units for which the user has other permissions only', () => {
    const response: IOpalFinesDraftAccountsResponse = {
      count: 2,
      summaries: [
        FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK,
        { ...FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK, draft_account_id: 102, business_unit_id: 34 },
      ],
    };

    expect(mapFinesFpuDraftAccountsToBusinessUnits(response, FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual([
      { business_unit_id: 78, business_unit_name: 'Zedford', ticket_count: 1 },
    ]);
  });

  it.each([
    OPAL_FINES_DRAFT_ACCOUNT_STATUSES.published,
    OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected,
    OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted,
    OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted,
    OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishPending,
    OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed,
  ])('excludes draft accounts with status %s', (accountStatus) => {
    const response: IOpalFinesDraftAccountsResponse = {
      count: 1,
      summaries: [{ ...FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK, account_status: accountStatus }],
    };

    expect(mapFinesFpuDraftAccountsToBusinessUnits(response, FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual([]);
  });

  it('does not count a draft account more than once', () => {
    const response: IOpalFinesDraftAccountsResponse = {
      count: 2,
      summaries: [
        FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK,
        structuredClone(FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK),
      ],
    };

    expect(mapFinesFpuDraftAccountsToBusinessUnits(response, FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual([
      { business_unit_id: 78, business_unit_name: 'Zedford', ticket_count: 1 },
    ]);
  });

  it('keeps business units with the same name separate by ID', () => {
    const response: IOpalFinesDraftAccountsResponse = {
      count: 2,
      summaries: [
        FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK,
        { ...FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK, draft_account_id: 102, business_unit_id: 12 },
      ],
    };

    expect(mapFinesFpuDraftAccountsToBusinessUnits(response, FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual([
      { business_unit_id: 78, business_unit_name: 'Zedford', ticket_count: 1 },
      { business_unit_id: 12, business_unit_name: 'Zedford', ticket_count: 1 },
    ]);
  });

  it('returns no business units when no submitted draft accounts are returned', () => {
    expect(
      mapFinesFpuDraftAccountsToBusinessUnits({ count: 0, summaries: [] }, FINES_FPU_PAYLOAD_USER_STATE_MOCK),
    ).toEqual([]);
  });

  it('returns no business units when the user has no publish permissions', () => {
    const userState = structuredClone(FINES_FPU_PAYLOAD_USER_STATE_MOCK);
    userState.business_unit_users.forEach((businessUnitUser) => (businessUnitUser.permissions = []));
    const response: IOpalFinesDraftAccountsResponse = {
      count: 1,
      summaries: [FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK],
    };

    expect(mapFinesFpuDraftAccountsToBusinessUnits(response, userState)).toEqual([]);
  });
});
