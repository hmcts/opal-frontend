import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { CreateManageDraftsLocators as CreateManage } from 'cypress/shared/selectors/create-manage-drafts.locators';
import { CheckAndValidateDraftsLocators as CheckValidate } from 'cypress/shared/selectors/manual-account-creation/check-and-validate/check-and-validate.drafts.locators';
import { DraftAccountsTableLocators as Table } from 'cypress/shared/selectors/draft-accounts-table.locators';
import { interceptMixedSourceDraftAccounts } from './intercept/draft-accounts-source.intercepts';
import { DraftAccountsJourney, setupDraftAccountsSourceComponent } from './setup/DraftAccountsSource.setup';

for (const journey of ['create-and-manage', 'check-and-validate'] as const satisfies readonly DraftAccountsJourney[]) {
  describe(`MAC draft account source: ${journey}`, () => {
    const locators = journey === 'create-and-manage' ? CreateManage : CheckValidate;
    const userFilter = journey === 'create-and-manage' ? 'submitted_by' : 'not_submitted_by';
    const countBadge = journey === 'create-and-manage' ? CreateManage.rejectedIcon : CheckValidate.failedCountIcon;

    for (const { enabled, includeMacAccounts } of [
      { enabled: true, includeMacAccounts: true },
      { enabled: true, includeMacAccounts: false },
      { enabled: false, includeMacAccounts: true },
    ]) {
      it(
        `keeps MAC listings and counts isolated (banking flag ${enabled}, MAC records ${includeMacAccounts})`,
        {
          tags: [
            '@JIRA-STORY:PO-10335',
            '@JIRA-LABEL:manual-account-creation',
            enabled ? '@R1CBankingInterfaces' : '@R1CBankingInterfacesOff',
          ],
        },
        () => {
          interceptMixedSourceDraftAccounts(includeMacAccounts);
          setupDraftAccountsSourceComponent(journey, enabled);
          cy.get(locators.navigationLinks)
            .contains(journey === 'create-and-manage' ? 'In review' : 'To review')
            .click();

          for (const alias of ['@draftTab', '@draftCount'] as const) {
            cy.wait(alias).then(({ request }) => {
              const params = new URL(request.url).searchParams;
              expect(params.getAll('business_unit')).to.deep.equal(
                OPAL_USER_STATE_MOCK.business_unit_users.map((user) => String(user.business_unit_id)),
              );
              expect(params.getAll(userFilter)).to.deep.equal(
                OPAL_USER_STATE_MOCK.business_unit_users.map((user) => user.business_unit_user_id),
              );
              if (enabled) {
                expect(params.get('source')).to.equal('MAC');
              } else {
                expect(params.has('source')).to.be.false;
              }
            });
          }

          if (includeMacAccounts) {
            cy.get(countBadge).should('contain.text', '1');
            cy.get(Table.rows).should('have.length', 1);
            cy.get(Table.cells.defendant).should('contain.text', 'MAC ACCOUNT');
          } else {
            cy.get(countBadge).should('not.exist');
            cy.get(Table.table).should('not.exist');
          }
          cy.get(locators.app).should('not.contain.text', 'CPP ACCOUNT').and('not.contain.text', 'VPFPO ACCOUNT');

          cy.get(locators.navigationLinks).contains('Deleted').click();
          cy.wait('@draftDeleted').then(({ request }) => {
            const params = new URL(request.url).searchParams;
            expect(params.has('account_status_date_from')).to.be.true;
            expect(params.has('account_status_date_to')).to.be.true;
            expect(params.has(userFilter)).to.be.true;
            expect(params.get('source')).to.equal(enabled ? 'MAC' : null);
          });
          cy.get(locators.app).should('not.contain.text', 'CPP ACCOUNT').and('not.contain.text', 'VPFPO ACCOUNT');
        },
      );
    }
  });
}
