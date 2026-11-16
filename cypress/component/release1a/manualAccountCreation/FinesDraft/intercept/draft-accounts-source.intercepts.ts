import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { createMixedSourceDraftAccounts } from '../mocks/draft-accounts-source.mock';

export const interceptMixedSourceDraftAccounts = (includeMacAccounts: boolean) => {
  const accounts = createMixedSourceDraftAccounts(includeMacAccounts);

  cy.intercept('GET', `${OPAL_FINES_PATHS.draftAccounts}?*`, (request) => {
    const params = new URL(request.url).searchParams;
    const statuses = params.getAll('status');
    const source = params.get('source') ?? 'MAC';
    const summaries = accounts
      .filter((account) => account.source === source && statuses.includes(account.summary.account_status))
      .map((account) => account.summary);

    request.alias = statuses.includes(OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted)
      ? 'draftTab'
      : statuses.includes(OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted)
        ? 'draftDeleted'
        : 'draftCount';
    request.reply({ count: summaries.length, summaries });
  });
};
