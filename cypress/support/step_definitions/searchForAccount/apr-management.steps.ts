import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { AprManagementActions } from '../../../e2e/functional/opal/actions/account-enquiry/apr-management.actions';
import { applyUniqPlaceholder } from '../../utils/stringUtils';

const aprManagementActions = () => new AprManagementActions();

When('I open APR Management from Payment terms', () => {
  aprManagementActions().openFromPaymentTerms();
});

Then('the APR Management link is hidden', () => {
  aprManagementActions().assertLinkHidden();
});

When('I add an alternate payment reference', () => {
  aprManagementActions().startAddingReference();
});

When('I change alternate payment reference {string}', (reference: string) => {
  aprManagementActions().startChangingReference(applyUniqPlaceholder(reference));
});

When('I save alternate payment reference {string}', (reference: string) => {
  aprManagementActions().saveReference(applyUniqPlaceholder(reference));
});

Given('I watch for alternate payment reference creation', () => {
  aprManagementActions().watchReferenceCreation();
});

Then('creation of the duplicate alternate payment reference is rejected', () => {
  aprManagementActions().assertDuplicateRejected('create');
});

Then('I see the alternate payment reference length error', () => {
  aprManagementActions().assertLengthError();
});

Then('the current alternate payment references include {string}', (reference: string) => {
  aprManagementActions().assertCurrentReference(applyUniqPlaceholder(reference));
});

Then('the current alternate payment references exclude {string}', (reference: string) => {
  aprManagementActions().assertNoCurrentReference(applyUniqPlaceholder(reference));
});

Then('there are no alternate payment references for the current account', () => {
  aprManagementActions().assertNoCurrentReferences();
});

When('I try to update to the duplicate alternate payment reference {string}', (reference: string) => {
  aprManagementActions().attemptDuplicateUpdate(applyUniqPlaceholder(reference));
});

Then('the duplicate alternate payment reference update is rejected', () => {
  aprManagementActions().assertDuplicateRejected('update');
});

When('I remove alternate payment reference {string}', (reference: string) => {
  aprManagementActions().startRemovingReference(applyUniqPlaceholder(reference));
});

When('I confirm removal of the alternate payment reference', () => {
  aprManagementActions().confirmRemoval();
});

When('I cancel removal of the alternate payment reference', () => {
  aprManagementActions().cancelRemoval();
});

When('I open APR Management for the read-only reference', () => {
  aprManagementActions().openWithReferences();
});

Then('the read-only consolidated reference {string} cannot be removed', (reference: string) => {
  aprManagementActions().assertReadOnlyReferenceCannotBeRemoved(reference);
});
