import { describe, expect, it } from 'vitest';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FINES_FPU_PAYLOAD_USER_STATE_MOCK } from '../mocks/fines-fpu-payload.mock';
import { buildFinesFpuDraftAccountParams } from './fines-fpu-payload-build-draft-account-params.utils';

describe('buildFinesFpuDraftAccountParams', () => {
  it('requests submitted VPFPO accounts only for business units with publish permission', () => {
    expect(buildFinesFpuDraftAccountParams(FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual({
      source: 'VPFPO',
      businessUnitIds: [78, 12, 90],
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted],
    });
  });

  it('does not restrict the request to an uploader or upload date', () => {
    const params = buildFinesFpuDraftAccountParams(FINES_FPU_PAYLOAD_USER_STATE_MOCK);

    expect(params).not.toHaveProperty('submittedBy');
    expect(params).not.toHaveProperty('notSubmittedBy');
    expect(params).not.toHaveProperty('accountStatusDateFrom');
    expect(params).not.toHaveProperty('accountStatusDateTo');
  });

  it('returns an empty business unit scope when the user has no publish permissions', () => {
    const userState = structuredClone(FINES_FPU_PAYLOAD_USER_STATE_MOCK);
    userState.business_unit_users.forEach((businessUnitUser) => (businessUnitUser.permissions = []));

    expect(buildFinesFpuDraftAccountParams(userState).businessUnitIds).toEqual([]);
  });

  it('returns an empty business unit scope when the user has no business units', () => {
    const userState = { ...FINES_FPU_PAYLOAD_USER_STATE_MOCK, business_unit_users: [] };

    expect(buildFinesFpuDraftAccountParams(userState).businessUnitIds).toEqual([]);
  });

  it('includes each permitted business unit once when the user has duplicate memberships', () => {
    const userState = structuredClone(FINES_FPU_PAYLOAD_USER_STATE_MOCK);
    userState.business_unit_users.push(structuredClone(userState.business_unit_users[0]));
    const originalUserState = structuredClone(userState);

    expect(buildFinesFpuDraftAccountParams(userState).businessUnitIds).toEqual([78, 12, 90]);
    expect(userState).toEqual(originalUserState);
  });
});
