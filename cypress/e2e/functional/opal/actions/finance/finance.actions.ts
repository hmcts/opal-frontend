import { FinanceLocators as L } from '../../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('FinanceActions');

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
    title: 'Variant banking file upload',
  },
};

/** Cypress actions for the Finance landing page banking-interface links. */
export class FinanceActions {
  private readonly common = new CommonActions();

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
