import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { describe, expect, it } from 'vitest';
import { buildFinesDraftAccountParams } from './fines-draft-account-params.utils';

describe('buildFinesDraftAccountParams', () => {
  it('should build params scoped to the current user business units', () => {
    const statuses = [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted];

    expect(
      buildFinesDraftAccountParams(OPAL_USER_STATE_MOCK, {
        statuses,
        includeSubmittedBy: false,
        includeNotSubmittedBy: false,
      }),
    ).toEqual({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses,
    });
  });

  it('should include submittedBy when requested', () => {
    const statuses = [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected];

    expect(
      buildFinesDraftAccountParams(OPAL_USER_STATE_MOCK, {
        statuses,
        includeSubmittedBy: true,
        includeNotSubmittedBy: false,
      }),
    ).toEqual({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses,
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
  });

  it('should include notSubmittedBy when requested', () => {
    const statuses = [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed];

    expect(
      buildFinesDraftAccountParams(OPAL_USER_STATE_MOCK, {
        statuses,
        includeSubmittedBy: false,
        includeNotSubmittedBy: true,
      }),
    ).toEqual({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses,
      notSubmittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
  });
});
