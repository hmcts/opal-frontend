/**
 * @file details.enforcement.actions.ts
 * @description Actions for the Account Details "Enforcement" tab and add override form.
 */
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { DOM_ELEMENTS as ENF_COURT_CHANGE } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement-court-change.locators';
import { DOM_ELEMENTS as ENF_OVR } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement-override-add.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsEnforcementActions');

/**
 * Actions for the Account Details enforcement tab and add override form.
 */
export class AccountDetailsEnforcementActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;

  /**
   * Normalizes visible text for reliable equality assertions.
   *
   * @param value - Raw text content.
   * @returns Text with collapsed whitespace.
   */
  private normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }

  /**
   * Selects an option from an accessible autocomplete control.
   *
   * @param selector - Input selector for the autocomplete.
   * @param query - Text to type into the input to filter options.
   * @param optionText - Visible option text to select from the dropdown.
   */
  private selectAutocompleteOption(selector: string, query: string, optionText: string): void {
    cy.get(selector, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click()
      .type('{selectall}{backspace}', { force: true })
      .type(query, { delay: 0 });

    cy.contains(ENF_OVR.dropdownOptions, optionText, {
      timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
    }).click();
    cy.get(selector, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should('contain.value', optionText);
  }

  /**
   * Asserts the Enforcement tab content is visible.
   */
  public assertEnforcementTabVisible(): void {
    log('assert', 'Enforcement tab is visible');
    cy.contains(ENF.tableTitle, 'Enforcement overview', {
      timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
    }).should('be.visible');
  }

  /**
   * Opens the add enforcement override form from the Enforcement tab.
   */
  public openAddEnforcementOverrideForm(): void {
    log('navigate', 'Opening add enforcement override form');
    cy.get(ENF.addEnforcementOverrideLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }

  /**
   * Opens the change enforcement court form from the Enforcement tab.
   */
  public openChangeEnforcementCourtForm(): void {
    log('navigate', 'Opening change enforcement court form');
    cy.get(ENF.changeEnforcementCourtLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }

  /**
   * Asserts the add enforcement override form is visible.
   */
  public assertAddEnforcementOverrideFormVisible(): void {
    log('assert', 'Add enforcement override form is visible');
    cy.get(ENF_OVR.title, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
      'be.visible',
    );
  }

  /**
   * Asserts the change enforcement court form is visible.
   */
  public assertChangeEnforcementCourtFormVisible(): void {
    log('assert', 'Change enforcement court form is visible');
    cy.get(ENF_COURT_CHANGE.title, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('contain.text', 'Change enforcement court');
    cy.get(ENF_COURT_CHANGE.enforcementCourtInput, {
      timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
    }).should('be.visible');
  }

  /**
   * Selects an enforcement override from the add form.
   *
   * @param resultCode - Enforcement override code to select.
   */
  public selectEnforcementOverride(resultCode: string): void {
    log('action', 'Selecting enforcement override', { resultCode });
    this.selectAutocompleteOption(ENF_OVR.enfOverrideDropdown, resultCode, resultCode);
  }

  /**
   * Selects a Local Justice Area from the add form.
   *
   * @param localJusticeArea - Visible LJA option text.
   */
  public selectLocalJusticeArea(localJusticeArea: string): void {
    log('action', 'Selecting Local Justice Area', { localJusticeArea });
    this.selectAutocompleteOption(ENF_OVR.localJusticeAreaDropdown, localJusticeArea, localJusticeArea);
  }

  /**
   * Selects an enforcer from the add form.
   *
   * @param enforcer - Visible enforcer option text.
   */
  public selectEnforcer(enforcer: string): void {
    log('action', 'Selecting enforcer', { enforcer });
    this.selectAutocompleteOption(ENF_OVR.enforcerDropdown, enforcer, enforcer);
  }

  /**
   * Stores the current enforcement court summary value under a Cypress alias.
   *
   * @param aliasName - Alias name to store the current value under.
   */
  public storeCurrentEnforcementCourtValue(aliasName: string): void {
    log('action', 'Storing current enforcement court summary value', { aliasName });
    cy.get(ENF.enforcementCourtValue, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .invoke('text')
      .then((value) => this.normalize(value))
      .then((value) => {
        expect(value, 'current enforcement court value').not.to.eq('');
        cy.wrap(value, { log: false }).as(aliasName);
      });
  }

  /**
   * Selects an enforcement court value that differs from the stored current value.
   *
   * @param currentAliasName - Alias containing the currently displayed enforcement court.
   * @param selectedAliasName - Alias to store the newly selected enforcement court under.
   */
  public selectDifferentEnforcementCourt(currentAliasName: string, selectedAliasName: string): void {
    log('action', 'Selecting a different enforcement court', { currentAliasName, selectedAliasName });
    cy.get(`@${currentAliasName}`).then((currentValue) => {
      const normalizedCurrentValue = this.normalize(String(currentValue ?? ''));

      cy.get(ENF_COURT_CHANGE.enforcementCourtInput, {
        timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
      })
        .should('be.visible')
        .click()
        .type('{downarrow}', { force: true });

      cy.get(ENF_COURT_CHANGE.dropdownOptions, {
        timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
      }).then(($options) => {
        const selectedValue = [...$options]
          .map((option) => this.normalize(option.textContent ?? ''))
          .find((option) => option && option !== normalizedCurrentValue);

        expect(selectedValue, 'different enforcement court option').to.be.a('string').and.not.be.empty;

        cy.wrap(selectedValue, { log: false }).as(selectedAliasName);
        cy.contains(ENF_COURT_CHANGE.dropdownOptions, selectedValue as string, {
          timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
        }).click();
        cy.get(ENF_COURT_CHANGE.enforcementCourtInput, {
          timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
        }).should('have.value', selectedValue as string);
      });
    });
  }

  /**
   * Selects an enforcement court using a previously stored alias value.
   *
   * @param aliasName - Alias containing the enforcement court text to select.
   */
  public selectEnforcementCourtFromAlias(aliasName: string): void {
    log('action', 'Selecting enforcement court from alias', { aliasName });
    cy.get(`@${aliasName}`).then((value) => {
      const enforcementCourt = String(value ?? '');
      this.selectAutocompleteOption(ENF_COURT_CHANGE.enforcementCourtInput, enforcementCourt, enforcementCourt);
    });
  }

  /**
   * Submits the add enforcement override form.
   */
  public submitAddEnforcementOverride(): void {
    log('action', 'Submitting add enforcement override form');
    cy.get(ENF_OVR.addOverrideButton, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  /**
   * Submits the change enforcement court form.
   */
  public submitChangeEnforcementCourt(): void {
    log('action', 'Submitting change enforcement court form');
    cy.get(ENF_COURT_CHANGE.submitButton, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  /**
   * Cancels the change enforcement court form without triggering a confirmation dialog.
   */
  public cancelChangeEnforcementCourtWithoutConfirmation(): void {
    log('action', 'Cancelling change enforcement court form without confirmation');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').as('changeEnforcementCourtConfirm');
    });

    cy.get(ENF_COURT_CHANGE.cancelLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .contains(/^Cancel$/i)
      .click();

    cy.get('@changeEnforcementCourtConfirm').should('not.have.been.called');
  }

  /**
   * Cancels the change enforcement court form after selecting a different value and confirms leaving.
   *
   * @param currentAliasName - Alias containing the current saved enforcement court value.
   */
  public cancelDirtyChangeEnforcementCourtWithConfirmation(currentAliasName: string): void {
    log('action', 'Cancelling dirty change enforcement court form with confirmation', { currentAliasName });

    this.selectDifferentEnforcementCourt(currentAliasName, 'unsavedEnforcementCourt');

    let confirmationShown = false;

    cy.once('window:confirm', (msg) => {
      confirmationShown = true;
      const normalized = String(msg).replace(/\s+/g, ' ');
      expect(normalized, 'Confirm prompt message').to.match(/unsaved changes/i);
      return true;
    });

    cy.get(ENF_COURT_CHANGE.cancelLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .contains(/^Cancel$/i)
      .click();

    cy.then(() => {
      expect(confirmationShown, 'Unsaved changes confirmation should be displayed').to.be.true;
    });
  }

  /**
   * Clicks the cancel link on the add enforcement override form.
   */
  public cancelAddEnforcementOverride(): void {
    log('action', 'Cancelling add enforcement override form');
    cy.get(ENF_OVR.cancelLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .contains(/^Cancel$/i)
      .click();
  }

  /**
   * Asserts the success banner text shown after saving.
   *
   * @param expected - Expected success message.
   */
  public assertSuccessBannerText(expected: string): void {
    log('assert', 'Enforcement success banner text', { expected });
    cy.get(ENF.successBanner, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .find(ENF.successBannerText)
      .should('contain.text', expected);
  }

  /**
   * Asserts the success banner is not visible.
   */
  public assertSuccessBannerNotVisible(): void {
    log('assert', 'Enforcement success banner not visible');
    cy.get(ENF.successBanner).should('not.exist');
  }

  /**
   * Asserts the enforcement court summary row matches a stored alias value.
   *
   * @param aliasName - Alias containing the expected enforcement court value.
   */
  public assertEnforcementCourtMatchesAlias(aliasName: string): void {
    log('assert', 'Enforcement court summary matches alias', { aliasName });
    cy.get(`@${aliasName}`).then((expectedValue) => {
      cy.get(ENF.enforcementCourtValue, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
        .should('be.visible')
        .invoke('text')
        .then((actualValue) => {
          expect(this.normalize(actualValue)).to.eq(this.normalize(String(expectedValue ?? '')));
        });
    });
  }

  /**
   * Asserts the enforcement override summary values on the Enforcement tab.
   *
   * @param expected - Expected summary values.
   * @param expected.override - Expected enforcement override display text.
   * @param expected.enforcer - Expected enforcer display text.
   * @param expected.lja - Expected Local Justice Area display text.
   */
  public assertEnforcementOverrideSummary(expected: { override?: string; enforcer?: string; lja?: string }): void {
    log('assert', 'Enforcement override summary', expected);

    if (expected.override) {
      cy.get(ENF.enforcementOverrideValue, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
        'contain.text',
        expected.override,
      );
    }

    if (expected.lja) {
      cy.get(ENF.localJusticeAreaValue, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
        'contain.text',
        expected.lja,
      );
    }

    if (expected.enforcer) {
      cy.get(ENF.enfOverrideEnforcer, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
        'contain.text',
        expected.enforcer,
      );
    }
  }
}
