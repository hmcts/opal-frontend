import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { DraftAccountRequestContractFlow } from '../../../e2e/functional/opal/flows/draft-account-request-contract.flow';

const flow = new DraftAccountRequestContractFlow();

When('I monitor the draft account POST contract', () => flow.monitorCreation());
When('I monitor the draft account PATCH contract', () => flow.monitorStatusChanges());

Then(
  'the draft account POST matches the contract for {string} and {string}',
  (defendantType: string, accountType: string) => {
    flow.assertCreation(defendantType, accountType);
  },
);

Then(
  'the draft account PATCH matches the contract for status {string} and reason {string}',
  (status: string, reason: string) => {
    flow.assertStatusChange(status, reason);
  },
);
