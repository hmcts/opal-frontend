import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCashInputPayerFlow } from '../../e2e/functional/opal/flows/manual-cash-input-payer.flow';

const payer = () => new ManualCashInputPayerFlow();

When('the suspense payer field {string} is {string}', (field: string, value: string) => {
  payer().setField(field, value);
});
Then('the suspense payer field {string} has error {string}', (field: string, message: string) => {
  payer().assertFieldError(field, message);
});

When('I record a suspense payment for reason {string}', (reason: string) => {
  payer().recordSuspense(reason);
});
Then('Payer Details displays the selected Manual Cash Input business unit', () => {
  payer().assertBusinessUnit();
});
Then('the suspense payer form is displayed', () => {
  payer().assertPayerPage();
});
When('the suspense payer has type {string} and {string} details', (type: string, details: string) => {
  payer().enterPayer(type, details);
});
When('the suspense payer type is {string}', (type: string) => {
  payer().selectType(type);
});
When('I continue with the suspense payer details', () => {
  payer().submitPayer();
});
Then('the suspense payment is ready for checking', () => {
  payer().assertCheckPayment();
});
When('I request {string} from Payer Details with {string} confirmation', (action: string, response: string) => {
  payer().leavePayer(action, response);
});
Then('the {string} payer details are retained', (type: string) => {
  payer().assertPayerRetained(type);
});
Then('the suspense payer journey returns using {string}', (action: string) => {
  payer().assertLeaveDestination(action);
});
Then('the payer data discarded using {string} does not reappear', (action: string) => {
  payer().assertDiscardedPayerDoesNotReturn(action);
});
Then('a suspense payer type is required', () => {
  payer().assertPayerTypeRequired();
});
