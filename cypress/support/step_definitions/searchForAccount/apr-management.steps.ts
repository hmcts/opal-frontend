import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { AprManagementActions } from '../../../e2e/functional/opal/actions/account-enquiry/apr-management.actions';
import { AprManagementFlow } from '../../../e2e/functional/opal/flows/apr-management.flow';
import { applyUniqPlaceholder } from '../../utils/stringUtils';

const aprManagementActions = () => new AprManagementActions();

const aprManagementFlow = () => new AprManagementFlow();

When('I open APR Management for defendant {string}', (surname: string) => {
  aprManagementFlow().openForDefendant(applyUniqPlaceholder(surname));
});

Then('the APR Management link is hidden', () => {
  aprManagementActions().assertLinkHidden();
});

When('I submit alternate payment reference {string}', (reference: string) => {
  aprManagementFlow().addReference(applyUniqPlaceholder(reference));
});

When(
  'I submit a change from alternate payment reference {string} to {string}',
  (current: string, replacement: string) => {
    aprManagementFlow().changeReference(applyUniqPlaceholder(current), applyUniqPlaceholder(replacement));
  },
);

Then('the current alternate payment references include {string}', (reference: string) => {
  aprManagementActions().assertCurrentReference(applyUniqPlaceholder(reference));
});

Then('the current alternate payment references exclude {string}', (reference: string) => {
  aprManagementActions().assertNoCurrentReference(applyUniqPlaceholder(reference));
});

Then('there are no alternate payment references for the current account', () => {
  aprManagementActions().assertNoCurrentReferences();
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
