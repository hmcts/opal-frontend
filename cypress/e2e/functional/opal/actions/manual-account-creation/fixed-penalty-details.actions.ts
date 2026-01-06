/**
 * @file Actions for Manual Account Creation - Fixed Penalty details page.
 * Handles form filling, assertions, validation checks, and navigation.
 */
import { FixedPenaltyDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/fixed-penalty.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

type OffenceType = 'vehicle' | 'non-vehicle';

type CourtDetailsPayload = Partial<{
  issuingAuthority: string;
  enforcementCourt: string;
}>;

type PersonalDetailsPayload = Partial<{
  title: string;
  firstNames: string;
  lastName: string;
  dob: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postcode: string;
}>;

type CompanyDetailsPayload = Partial<{
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postcode: string;
}>;

type OffenceDetailsPayload = Partial<{
  noticeNumber: string;
  offenceType: OffenceType;
  dateOfOffence: string;
  offenceCode: string;
  timeOfOffence: string;
  placeOfOffence: string;
  amountImposed: string;
}>;

type VehicleDetailsPayload = Partial<{
  registrationNumber: string;
  drivingLicenceNumber: string;
  ntoNumber: string;
  dateNtoIssued: string;
}>;

type CommentDetailsPayload = Partial<{
  comment: string;
  note: string;
}>;

type FixedPenaltyPayload = {
  court?: CourtDetailsPayload;
  personal?: PersonalDetailsPayload;
  company?: CompanyDetailsPayload;
  offence?: OffenceDetailsPayload;
  vehicle?: VehicleDetailsPayload;
  comments?: CommentDetailsPayload;
};

const log = createScopedLogger('FixedPenaltyDetailsActions');

/**
 * Interactions for the Fixed Penalty details form.
 */
export class FixedPenaltyDetailsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Fixed Penalty details page is loaded.
   * @param expectedHeader - Header text to assert.
   */
  assertOnDetailsPage(expectedHeader: string = 'Fixed Penalty details'): void {
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Fills the Fixed Penalty form using a composite Section/Field/Value table.
   * @param rows - Raw DataTable rows including headers.
   */
  fillFromTable(rows: string[][]): void {
    const payload = this.mapTableToPayload(rows);
    log('flow', 'Completing Fixed Penalty details from table', { payload });

    if (payload.court) {
      this.fillCourtDetails(payload.court);
    }
    if (payload.personal) {
      this.fillPersonalDetails(payload.personal);
    }
    if (payload.company) {
      this.fillCompanyDetails(payload.company);
    }
    if (payload.offence) {
      this.fillOffenceDetails(payload.offence);
    }
    if (payload.vehicle) {
      this.fillVehicleDetails(payload.vehicle, payload.offence?.offenceType);
    }
    if (payload.comments) {
      this.fillComments(payload.comments);
    }
  }

  /**
   * Asserts field values on the Fixed Penalty form.
   * @param expected - Map of labels to expected values.
   */
  assertFields(expected: Record<string, string>): void {
    const entries = Object.entries(expected ?? {});
    if (!entries.length) {
      log('warn', 'assertFields invoked with empty expectations');
      return;
    }

    entries.forEach(([label, value]) => {
      const selector = this.resolveSelector(label);
      const normalized = (value ?? '').trim();
      if (!selector) {
        throw new Error(`Unsupported Fixed Penalty field for assertion: ${label}`);
      }

      if (selector === L.titleSelect) {
        cy.get(selector, this.common.getTimeoutOptions())
          .should('exist')
          .find('option:selected')
          .invoke('text')
          .should((text) => expect(text.trim()).to.eq(normalized));
        return;
      }

      cy.get(selector, this.common.getTimeoutOptions()).should('have.value', normalized);
    });
  }

  /**
   * Asserts an inline error appears above a specific field.
   * @param fieldLabel - Human readable field label.
   * @param message - Expected error message.
   */
  assertInlineError(fieldLabel: string, message: string): void {
    const selector = this.resolveSelector(fieldLabel);
    if (!selector) {
      throw new Error(`Unsupported Fixed Penalty field for error assertion: ${fieldLabel}`);
    }

    const inputId = selector.replace(/^#/, '');
    cy.get('body').then(($body) => {
      const inlineId = `#${inputId}-error`;
      if ($body.find(inlineId).length) {
        cy.get(inlineId, this.common.getTimeoutOptions()).should('contain.text', message);
        return;
      }
      cy.get('.govuk-error-summary', this.common.getTimeoutOptions()).should('contain.text', message);
    });
  }

  /**
   * Clicks Review Account to move to the review page.
   */
  reviewAccount(): void {
    cy.get(L.reviewButton, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Clicks Cancel and chooses whether to leave the page.
   * @param choice - "Ok" to leave or "Cancel" to stay.
   */
  cancelAndChoose(choice: 'Ok' | 'Cancel'): void {
    const accept = choice.toLowerCase() === 'ok';
    this.common.confirmNextUnsavedChanges(accept);
    cy.contains('a, button', /^cancel$/i, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Navigates via the back link to the previous page.
   */
  clickBackLink(): void {
    cy.get(L.backLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Maps a Section/Field/Value table into the payload used to populate the form.
   * @param rows - Raw DataTable rows including headers.
   * @returns Structured payload partitioned by section.
   */
  private mapTableToPayload(rows: string[][]): FixedPenaltyPayload {
    if (!rows.length) {
      throw new Error('No rows supplied for Fixed Penalty details');
    }

    const [header, ...body] = rows;
    const sectionIdx = header.findIndex((h) => h?.trim().toLowerCase() === 'section');
    const fieldIdx = header.findIndex((h) => h?.trim().toLowerCase() === 'field');
    const valueIdx = header.findIndex((h) => h?.trim().toLowerCase() === 'value');

    if (sectionIdx === -1 || fieldIdx === -1 || valueIdx === -1) {
      throw new Error('Table must include Section, Field, and Value columns');
    }

    const payload: FixedPenaltyPayload = {};

    body.forEach((row) => {
      const section = (row[sectionIdx] ?? '').trim().toLowerCase();
      const field = (row[fieldIdx] ?? '').trim().toLowerCase();
      const value = (row[valueIdx] ?? '').trim();

      if (!section || !field) return;

      if (/court|issuing/.test(section)) {
        payload.court ??= {};
        if (/issuing/.test(field)) {
          payload.court.issuingAuthority = value;
        } else if (/enforcement/.test(field)) {
          payload.court.enforcementCourt = value;
        }
        return;
      }

      if (/personal/.test(section)) {
        payload.personal ??= {};
        if (/title/.test(field)) payload.personal.title = value;
        else if (/first/.test(field)) payload.personal.firstNames = value;
        else if (/last/.test(field) || /surname/.test(field)) payload.personal.lastName = value;
        else if (/date of birth|dob/.test(field)) payload.personal.dob = value;
        else if (/address line 1/.test(field)) payload.personal.addressLine1 = value;
        else if (/address line 2/.test(field)) payload.personal.addressLine2 = value;
        else if (/address line 3/.test(field)) payload.personal.addressLine3 = value;
        else if (/postcode|post code/.test(field)) payload.personal.postcode = value;
        return;
      }

      if (/company/.test(section)) {
        payload.company ??= {};
        if (/company name/.test(field)) payload.company.companyName = value;
        else if (/address line 1/.test(field)) payload.company.addressLine1 = value;
        else if (/address line 2/.test(field)) payload.company.addressLine2 = value;
        else if (/address line 3/.test(field)) payload.company.addressLine3 = value;
        else if (/postcode|post code/.test(field)) payload.company.postcode = value;
        return;
      }

      if (/offence/.test(section)) {
        payload.offence ??= {};
        if (/notice number/.test(field)) payload.offence.noticeNumber = value;
        else if (/date of offence/.test(field)) payload.offence.dateOfOffence = value;
        else if (/offence code/.test(field)) payload.offence.offenceCode = value;
        else if (/time of offence/.test(field)) payload.offence.timeOfOffence = value;
        else if (/place of offence/.test(field)) payload.offence.placeOfOffence = value;
        else if (/amount imposed/.test(field)) payload.offence.amountImposed = value;
        else if (/offence type/.test(field)) {
          const normalizedType = value.trim().toLowerCase();
          const isNonVehicle = /non[\s-]*vehicle/.test(normalizedType);
          const isVehicle = /vehicle/.test(normalizedType);

          if (isNonVehicle) {
            payload.offence.offenceType = 'non-vehicle';
          } else if (isVehicle) {
            payload.offence.offenceType = 'vehicle';
          } else {
            payload.offence.offenceType = 'non-vehicle';
          }
        }
        return;
      }

      if (/vehicle/.test(section)) {
        payload.vehicle ??= {};
        if (/registration/.test(field)) payload.vehicle.registrationNumber = value;
        else if (/driving licence/.test(field)) payload.vehicle.drivingLicenceNumber = value;
        else if (/notice to owner|nto|nth/.test(field)) payload.vehicle.ntoNumber = value;
        else if (/date notice/.test(field)) payload.vehicle.dateNtoIssued = value;
        return;
      }

      if (/comment|note/.test(section)) {
        payload.comments ??= {};
        if (/comment/.test(field)) payload.comments.comment = value;
        else if (/note/.test(field)) payload.comments.note = value;
      }
    });

    return payload;
  }

  /**
   * Fills the court details fields.
   * @param payload - Partial court details payload.
   */
  private fillCourtDetails(payload: CourtDetailsPayload): void {
    if (!payload.issuingAuthority && !payload.enforcementCourt) return;

    if (payload.issuingAuthority !== undefined) {
      this.typeAutocomplete(
        L.issuingAuthorityInput,
        L.issuingAuthorityListbox,
        payload.issuingAuthority,
        'Issuing Authority',
      );
    }
    if (payload.enforcementCourt !== undefined) {
      this.typeAutocomplete(
        L.enforcementCourtInput,
        L.enforcementCourtListbox,
        payload.enforcementCourt,
        'Enforcement court',
      );
    }
  }

  /**
   * Fills the personal details fields.
   * @param payload - Partial personal details payload.
   */
  private fillPersonalDetails(payload: PersonalDetailsPayload): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    if (!entries.length) return;

    if (payload.title !== undefined) {
      cy.get(L.titleSelect, this.common.getTimeoutOptions())
        .should('exist')
        .scrollIntoView()
        .select(payload.title, { force: true });
    }

    this.typeField(L.firstNamesInput, payload.firstNames, 'First names');
    this.typeField(L.lastNameInput, payload.lastName, 'Last name');
    this.typeField(L.dobInput, payload.dob, 'Date of birth');
    this.typeField(L.addressLine1Input, payload.addressLine1, 'Address line 1');
    this.typeField(L.addressLine2Input, payload.addressLine2, 'Address line 2');
    this.typeField(L.addressLine3Input, payload.addressLine3, 'Address line 3');
    this.typeField(L.postcodeInput, payload.postcode, 'Postcode');
  }

  /**
   * Fills the company details fields when present.
   * @param payload - Partial company details payload.
   */
  private fillCompanyDetails(payload: CompanyDetailsPayload): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    if (!entries.length) return;

    this.typeField(L.companyNameInput, payload.companyName, 'Company name');
    this.typeField(L.companyAddressLine1Input, payload.addressLine1, 'Company address line 1');
    this.typeField(L.companyAddressLine2Input, payload.addressLine2, 'Company address line 2');
    this.typeField(L.companyAddressLine3Input, payload.addressLine3, 'Company address line 3');
    this.typeField(L.companyPostcodeInput, payload.postcode, 'Company postcode');
  }

  /**
   * Fills offence details fields, including offence type selection when provided.
   * @param payload - Partial offence details payload.
   */
  private fillOffenceDetails(payload: OffenceDetailsPayload): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    if (!entries.length) return;

    if (payload.offenceType) {
      this.selectOffenceType(payload.offenceType);
    }
    this.typeField(L.noticeNumberInput, payload.noticeNumber, 'Notice number');
    this.typeField(L.dateOfOffenceInput, payload.dateOfOffence, 'Date of offence');
    this.typeField(L.offenceCodeInput, payload.offenceCode, 'Offence code');
    this.typeField(L.timeOfOffenceInput, payload.timeOfOffence, 'Time of offence');
    this.typeField(L.placeOfOffenceInput, payload.placeOfOffence, 'Place of offence');
    this.typeField(L.amountImposedInput, payload.amountImposed, 'Amount imposed');
  }

  /**
   * Fills vehicle details and ensures offence type is set to vehicle when needed.
   * @param payload - Partial vehicle details payload.
   * @param offenceType - Offence type, used to guard switching radios.
   */
  private fillVehicleDetails(payload: VehicleDetailsPayload, offenceType?: OffenceType): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    if (!entries.length) return;

    if (offenceType !== 'vehicle') {
      this.selectOffenceType('vehicle');
    }

    this.typeField(L.vehicleRegistrationInput, payload.registrationNumber, 'Registration number');
    this.typeField(L.drivingLicenceInput, payload.drivingLicenceNumber, 'Driving licence number');
    this.typeField(L.ntoNumberInput, payload.ntoNumber, 'Notice to owner or hirer number (NTO/NTH)');
    this.typeField(L.dateNtoIssuedInput, payload.dateNtoIssued, 'Date notice to owner was issued');
  }

  /**
   * Fills comment and note fields when supplied.
   * @param payload - Comment details payload.
   */
  private fillComments(payload: CommentDetailsPayload): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    if (!entries.length) return;

    this.typeField(L.commentInput, payload.comment, 'Add comment');
    this.typeField(L.noteInput, payload.note, 'Add account notes');
  }

  /**
   * Selects an offence type radio option.
   * @param type - Offence type value.
   */
  private selectOffenceType(type: OffenceType): void {
    const selector = L.offenceTypeRadio(type);
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Types into a text field with basic normalization/assertion.
   * @param selector - CSS selector for the input.
   * @param value - Value to enter.
   * @param label - Human-friendly label for error messaging.
   */
  private typeField(selector: string, value: string | undefined, label: string): void {
    if (value === undefined) return;
    const input = cy.get(selector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });
    if (value === '') {
      input.should('have.value', '');
      return;
    }
    input.type(value, { force: true, delay: 0 }).should(($el) => {
      const normalize = (val: string | undefined) =>
        String(val ?? '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      const actualValue = normalize($el.val() as string | undefined);
      const expectedValue = normalize(value);
      expect(actualValue, `Expected ${label} to match typed value (case-insensitive/trimmed)`).to.equal(expectedValue);
    });
  }

  /**
   * Types into an autocomplete input and selects the first option.
   * @param inputSelector - Input selector.
   * @param listboxSelector - Listbox selector.
   * @param value - Text to type.
   * @param label - Field label for logging.
   */
  private typeAutocomplete(inputSelector: string, listboxSelector: string, value: string, label: string): void {
    const input = cy.get(inputSelector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });

    if (value === '') {
      input.should('have.value', '');
      return;
    }

    input.type(value, { force: true, delay: 0 }).should('have.value', value);
    cy.get(listboxSelector, this.common.getTimeoutOptions()).should('exist');
    cy.get(inputSelector).type('{downarrow}{enter}', { force: true });
    cy.get(inputSelector, this.common.getTimeoutOptions()).invoke('val').should('not.be.empty');
    log('select', `Selected autocomplete option for ${label}`, { value });
  }

  /**
   * Resolves a human-readable field label to its CSS selector.
   * @param fieldLabel - Field label from feature files.
   * @returns CSS selector or null if unsupported.
   */
  private resolveSelector(fieldLabel: string): string | null {
    const normalized = fieldLabel.trim().toLowerCase();
    if (/title/.test(normalized)) return L.titleSelect;
    if (/first/.test(normalized)) return L.firstNamesInput;
    if (/last/.test(normalized) || /surname/.test(normalized)) return L.lastNameInput;
    if (/date of birth|dob/.test(normalized)) return L.dobInput;
    if (/address line 1/.test(normalized)) return L.addressLine1Input;
    if (/address line 2/.test(normalized)) return L.addressLine2Input;
    if (/address line 3/.test(normalized)) return L.addressLine3Input;
    if (/postcode|post code/.test(normalized) && !/company/.test(normalized)) return L.postcodeInput;
    if (/company name/.test(normalized)) return L.companyNameInput;
    if (/company address line 1/.test(normalized)) return L.companyAddressLine1Input;
    if (/company address line 2/.test(normalized)) return L.companyAddressLine2Input;
    if (/company address line 3/.test(normalized)) return L.companyAddressLine3Input;
    if (/company postcode|company post code/.test(normalized)) return L.companyPostcodeInput;
    if (/notice number/.test(normalized) && !/owner/.test(normalized)) return L.noticeNumberInput;
    if (/date of offence/.test(normalized)) return L.dateOfOffenceInput;
    if (/offence code/.test(normalized)) return L.offenceCodeInput;
    if (/time of offence/.test(normalized)) return L.timeOfOffenceInput;
    if (/place of offence/.test(normalized)) return L.placeOfOffenceInput;
    if (/amount imposed/.test(normalized)) return L.amountImposedInput;
    if (/registration/.test(normalized)) return L.vehicleRegistrationInput;
    if (/driving licence/.test(normalized)) return L.drivingLicenceInput;
    if (/owner|hirer|nto|nth/.test(normalized)) return L.ntoNumberInput;
    if (/date notice to owner/.test(normalized)) return L.dateNtoIssuedInput;
    if (/comment/.test(normalized)) return L.commentInput;
    if (/note/.test(normalized)) return L.noteInput;
    if (/issuing/.test(normalized)) return L.issuingAuthorityInput;
    if (/enforcement/.test(normalized)) return L.enforcementCourtInput;
    return null;
  }
}
