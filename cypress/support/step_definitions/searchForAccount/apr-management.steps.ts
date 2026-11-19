import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { AprManagementActions } from '../../../e2e/functional/opal/actions/account-enquiry/apr-management.actions';

const aprManagementActions = () => new AprManagementActions();

When('I open APR Management from Payment terms', () => {
  aprManagementActions().openFromPaymentTerms();
});

Then('the APR Management link is hidden', () => {
  aprManagementActions().assertLinkHidden();
});
