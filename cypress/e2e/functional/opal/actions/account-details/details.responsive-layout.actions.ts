import { AccountAtAGlanceLocators as A } from '../../../../../shared/selectors/account-details/account.at-a-glance.details.locators';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as H } from '../../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsResponsiveLayoutActions');

/** Responsive layout assertions for the Account Details page. */
export class AccountDetailsResponsiveLayoutActions {
  /**
   * Sets the viewport used for responsive layout checks.
   *
   * @param width - Viewport width in CSS pixels.
   * @param height - Viewport height in CSS pixels.
   */
  public setViewport(width: number, height: number): void {
    log('action', 'Setting responsive viewport', { width, height });
    cy.viewport(width, height);
  }

  /** Asserts that the document and body fit within the current viewport. */
  public assertNoHorizontalOverflow(): void {
    cy.window().then((win) => {
      const { body, documentElement } = win.document;

      expect(documentElement.scrollWidth, 'document should not overflow the viewport').to.be.at.most(
        documentElement.clientWidth + 1,
      );
      expect(body.scrollWidth, 'body should not overflow the viewport').to.be.at.most(body.clientWidth + 1);
    });
  }

  /** Asserts that the header actions are visible, non-overlapping, and below the account title. */
  public assertHeaderActionReflowsBelowTitle(): void {
    cy.get(H.headingName, { timeout: 15_000 }).then(($heading) => {
      const headingBounds = $heading[0].getBoundingClientRect();

      cy.get(H.addNoteButton, { timeout: 15_000 }).then(($button) => {
        const buttonBounds = $button[0].getBoundingClientRect();

        cy.get(H.moreOptionsButton, { timeout: 15_000 }).then(($moreOptionsButton) => {
          const moreOptionsBounds = $moreOptionsButton[0].getBoundingClientRect();
          const viewportWidth = Cypress.config('viewportWidth');
          const actionsOverlap =
            buttonBounds.left < moreOptionsBounds.right &&
            buttonBounds.right > moreOptionsBounds.left &&
            buttonBounds.top < moreOptionsBounds.bottom &&
            buttonBounds.bottom > moreOptionsBounds.top;

          expect(buttonBounds.top, 'add account note button should be below the account name').to.be.at.least(
            headingBounds.bottom,
          );
          expect(moreOptionsBounds.top, 'more options button should be below the account name').to.be.at.least(
            headingBounds.bottom,
          );
          expect(buttonBounds.right, 'add account note button should be fully visible').to.be.at.most(viewportWidth);
          expect(moreOptionsBounds.right, 'more options button should be fully visible').to.be.at.most(viewportWidth);
          expect(actionsOverlap, 'header actions should not overlap').to.equal(false);
        });
      });
    });
  }

  /** Asserts that the At a glance columns have stacked into a vertical sequence. */
  public assertAtAGlanceColumnsStacked(): void {
    cy.get(A.layout.defendantColumn, { timeout: 15_000 }).then(($defendantColumn) => {
      const defendantBottom = $defendantColumn[0].getBoundingClientRect().bottom;

      cy.get(A.layout.paymentTermsColumn, { timeout: 15_000 }).then(($paymentTermsColumn) => {
        const paymentTermsBounds = $paymentTermsColumn[0].getBoundingClientRect();

        expect(paymentTermsBounds.top, 'payment terms should start below defendant details').to.be.at.least(
          defendantBottom,
        );

        cy.get(A.layout.enforcementStatusColumn, { timeout: 15_000 }).then(($enforcementStatusColumn) => {
          expect(
            $enforcementStatusColumn[0].getBoundingClientRect().top,
            'enforcement status should start below payment terms',
          ).to.be.at.least(paymentTermsBounds.bottom);
        });
      });
    });
  }
}
