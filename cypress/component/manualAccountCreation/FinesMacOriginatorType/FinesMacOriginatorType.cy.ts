import { FINES_MAC_ROUTING_PATHS } from '@app/flows/fines/fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { IFinesComponentProperties } from '../setup/FinesComponent.interface';
import { setupFinesMacComponent } from '../setup/FinesComponent.setup';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { CreateNewOrTransferInLocators as DOM } from 'cypress/shared/selectors/manual-account-creation/create-transfer.locators';

describe('Manual account creation - Originator Type', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  });

  it('Validate Originator Type page renders as designed', () => {
    const props: IFinesComponentProperties = {
      draftAccountId: '100',
      fragments: undefined,
      componentUrl: `${FINES_MAC_ROUTING_PATHS.children.originatorType}`,
      interceptedRoutes: ['create-account', 'dashboard'],
      isCheckerUser: false,
    };
    setupFinesMacComponent(props);

    cy.get(DOM.pageHeader).should('contain.text', 'Do you want to create a new account or transfer in?');
    cy.get(DOM.originatorType.createNew).should('exist');
    cy.get(DOM.originatorType.transferIn).should('exist');
    cy.get(DOM.continueButton).should('exist');
    cy.get(DOM.cancelLink).should('exist');

    cy.get(DOM.originatorType.createNew).should('not.be.checked');
    cy.get(DOM.originatorType.transferIn).should('not.be.checked');

    cy.get(DOM.originatorType.createNew).check({ force: true }).should('be.checked');
    cy.get(DOM.originatorType.transferIn).should('not.be.checked');

    cy.get(DOM.originatorType.transferIn).check({ force: true }).should('be.checked');
    cy.get(DOM.originatorType.createNew).should('not.be.checked');

    cy.get(DOM.continueButton).click({ force: true });
    cy.get('@routerNavigate').should('have.been.calledWith', ['create-account']);
  });
});
