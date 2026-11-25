import { FinanceLocators as L } from '../../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { requestLoggedInUserState } from '../user-state.actions';

const log = createScopedLogger('FinanceActions');

export type SuspensePermissionCombination = 'View only' | 'Manage only' | 'Both' | 'Neither';

export type FinanceBankingInterfaceLink = 'Inbound files' | 'Outbound files' | 'Upload variant banking files';

type FinanceLinkConfig = {
  selector: string;
  path: string;
  title: string;
};

const FINANCE_LINK_CONFIG: Record<FinanceBankingInterfaceLink, FinanceLinkConfig> = {
  'Inbound files': {
    selector: L.inboundFilesLink,
    path: '/fines/finance/inbound-files/search',
    title: 'Inbound file viewer',
  },
  'Outbound files': {
    selector: L.outboundFilesLink,
    path: '/fines/finance/outbound-files/search',
    title: 'Outbound file viewer',
  },
  'Upload variant banking files': {
    selector: L.uploadVariantBankingFilesLink,
    path: '/fines/finance/variant-banking-files/upload',
    title: 'Upload variant banking files',
  },
};

/** Cypress actions for Finance landing-page links and permissions. */
export class FinanceActions {
  private readonly common = new CommonActions();

  /**
   * Verifies the real account has the expected Suspense combination across all Fines BUs.
   * @param combination - Expected View/Manage permission combination for the signed-in user.
   */
  public assertSuspensePermissions(combination: SuspensePermissionCombination): void {
    const expected = {
      'View only': [true, false],
      'Manage only': [false, true],
      Both: [true, true],
      Neither: [false, false],
    }[combination];
    expect(expected, 'known Suspense permission combination').to.exist;

    requestLoggedInUserState().then((state) => {
      const memberships = state['business_unit_users'] as {
        permissions: { permission_id: number; permission_name: string }[];
      }[];
      expect(memberships, 'real Fines BU memberships').to.be.an('array').and.not.be.empty;
      const permissions = memberships.flatMap((membership) => membership.permissions);
      // Assert the backend permission contract independently of the application's constants.
      const checks = [
        { name: 'View Suspense Items', id: 25 },
        { name: 'Manage Suspense Items', id: 26 },
      ];

      checks.forEach(({ name, id }, index) => {
        expect(
          permissions.some((permission) => permission.permission_name === name),
          name,
        ).to.eq(expected[index]);
        expect(
          permissions.some((permission) => permission.permission_id === id),
          `${name} ID ${id}`,
        ).to.eq(expected[index]);
      });
    });
  }

  /** Asserts the heading and exactly one same-tab Suspense link are available. */
  public assertSuspenseSectionVisible(): void {
    cy.contains(L.suspenseHeading, L.labels.suspense, this.common.getTimeoutOptions()).should('be.visible');
    cy.get(L.manageSuspenseItemsLink, this.common.getTimeoutOptions())
      .should('have.length', 1)
      .and('be.visible')
      .and('have.text', L.labels.manageSuspenseItems)
      .and('have.attr', 'href', '/fines/suspense-item/search')
      .and('have.attr', 'target', '_self');
  }

  /** Asserts that neither the Suspense heading nor its link is rendered. */
  public assertSuspenseSectionHidden(): void {
    cy.get(L.manageSuspenseItemsLink).should('not.exist');
    cy.contains(L.suspenseHeading, L.labels.suspense).should('not.exist');
  }

  /** Opens the real Suspense journey from Finance. */
  public openSuspenseItems(): void {
    cy.get(L.manageSuspenseItemsLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /** Verifies that the permitted user reaches the Suspense search destination. */
  public assertSuspenseSearchPage(): void {
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', '/fines/suspense-item/search');
    cy.contains('h1', 'Search for suspense item', this.common.getTimeoutOptions()).should('be.visible');
  }

  /** Asserts that the banking-interface section heading is visible. */
  public assertBankingInterfacesSectionVisible(): void {
    log('assert', 'Checking the External banking interfaces section is visible');
    cy.contains('h2', L.labels.bankingInterfaces, this.common.getTimeoutOptions()).should('be.visible');
  }

  /** Asserts that all banking-interface links are visible and open in the same tab. */
  public assertBankingInterfaceLinksVisible(): void {
    Object.entries(FINANCE_LINK_CONFIG).forEach(([linkLabel, config]) => {
      cy.get(config.selector, this.common.getTimeoutOptions())
        .should('be.visible')
        .and('contain.text', linkLabel)
        .and('have.attr', 'target', '_self');
    });
  }

  /**
   * Opens a banking-interface link and verifies its route.
   * @param linkLabel - Visible label of the link to open.
   */
  public openBankingInterfaceLink(linkLabel: FinanceBankingInterfaceLink): void {
    const { selector, path, title } = FINANCE_LINK_CONFIG[linkLabel];

    log('action', 'Opening Finance banking-interface link', { linkLabel });
    cy.get(selector, this.common.getTimeoutOptions()).should('be.visible').click();
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', path);
    cy.title().should('contain', title);
  }
}
