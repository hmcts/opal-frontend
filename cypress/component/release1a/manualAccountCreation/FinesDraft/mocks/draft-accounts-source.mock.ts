import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';

export const createMixedSourceDraftAccounts = (includeMacAccounts: boolean) => {
  const sources: NonNullable<IOpalFinesDraftAccountParams['source']>[] = includeMacAccounts
    ? ['MAC', 'CPP', 'VPFPO']
    : ['CPP', 'VPFPO'];

  return sources.flatMap((source, sourceIndex) =>
    [
      OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted,
      OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected,
      OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed,
      OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted,
    ].map((status, statusIndex) => ({
      source,
      summary: {
        ...structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0]),
        draft_account_id: sourceIndex * 10 + statusIndex,
        account_type: FINES_ACCOUNT_TYPES.Fine,
        account_status: status,
        account_status_date: new Date().toISOString(),
        account_snapshot: {
          ...structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot),
          account_type: FINES_ACCOUNT_TYPES.Fine,
          created_date: new Date().toISOString(),
          defendant_name: `${source} ACCOUNT`,
          date_of_birth: null,
        },
      },
    })),
  );
};
