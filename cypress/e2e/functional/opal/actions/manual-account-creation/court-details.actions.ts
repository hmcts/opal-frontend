import { ManualCourtDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/court-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common.actions';

export class ManualCourtDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Completes the Court details form (LJA, PCR, enforcement court).
   */
  fillCourtDetails(lja: string, pcr: string, enforcementCourt: string): void {
    this.setLja(lja);
    this.setPcr(pcr);
    this.setEnforcementCourt(enforcementCourt);
  }

  private setLja(lja: string): void {
    log('type', 'Setting LJA', { lja });
    cy.get(L.ljaInput, this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(lja, { delay: 0 });
    cy.get(L.ljaListbox, this.common.getTimeoutOptions()).should('be.visible');
    cy.get(L.ljaInput).type('{downarrow}{enter}');
  }

  private setPcr(pcr: string): void {
    log('type', 'Setting PCR', { pcr });
    cy.get(L.pcrInput, this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(pcr, { delay: 0 });
  }

  private setEnforcementCourt(enforcementCourt: string): void {
    log('type', 'Setting enforcement court', { enforcementCourt });
    cy.get(L.enforcementCourtInput, this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(enforcementCourt, { delay: 0 });

    cy.get(L.enforcementCourtListbox, this.common.getTimeoutOptions()).should('be.visible');
    cy.get(L.enforcementCourtInput).type('{downarrow}{enter}');
  }
}
