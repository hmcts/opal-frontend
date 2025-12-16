import { DashboardActions } from '../actions/dashboard.actions';
import {
  AccountType,
  DefendantType,
  ManualCreateAccountActions,
} from '../actions/manual-account-creation/create-account.actions';
import { ManualAccountDetailsActions } from '../actions/manual-account-creation/account-details.actions';
import { ManualAccountCommentsNotesActions } from '../actions/manual-account-creation/account-comments-notes.actions';
import { ManualAccountTaskName } from '../../../../shared/selectors/manual-account-creation/account-details.locators';
import { ManualAccountTaskNavigationActions } from '../actions/manual-account-creation/task-navigation.actions';
import {
  ManualContactDetailsActions,
  ManualContactFieldKey,
} from '../actions/manual-account-creation/contact-details.actions';
import {
  ManualParentGuardianDetailsActions,
  ManualParentGuardianDetailsPayload,
  ManualParentGuardianFieldKey,
} from '../actions/manual-account-creation/parent-guardian-details.actions';
import {
  ManualEmployerDetailsActions,
  ManualEmployerFieldKey,
} from '../actions/manual-account-creation/employer-details.actions';
import { log } from '../../../../support/utils/log.helper';
import { CommonActions } from '../actions/common/common.actions';
import { ManualCompanyDetailsActions } from '../actions/manual-account-creation/company-details.actions';
import {
  ManualCourtDetailsActions,
  ManualCourtFieldKey,
} from '../actions/manual-account-creation/court-details.actions';
import {
  ManualPersonalDetailsActions,
  ManualPersonalDetailsFieldKey,
  ManualPersonalDetailsPayload,
} from '../actions/manual-account-creation/personal-details.actions';
import { ManualOffenceDetailsActions } from '../actions/manual-account-creation/offence-details.actions';
import { ManualOffenceReviewActions } from '../actions/manual-account-creation/offence-review.actions';
import { ManualOffenceSearchActions } from '../actions/manual-account-creation/offence-search.actions';
import { ManualReviewAccountActions } from '../actions/manual-account-creation/review-account.actions';
import {
  ManualPaymentTermsActions,
  ManualPaymentTermsExpectations,
  ManualPaymentTermsInput,
  PaymentFrequencyOption,
  PaymentTermOption,
  EnforcementActionOption,
} from '../actions/manual-account-creation/payment-terms.actions';
import {
  LanguageOption,
  ManualLanguagePreferencesActions,
} from '../actions/manual-account-creation/language-preferences.actions';
import { ManualOffenceMinorCreditorActions } from '../actions/manual-account-creation/offence-minor-creditor.actions';
import { accessibilityActions } from '../actions/accessibility/accessibility.actions';
import { calculateWeeksInPast, resolveRelativeDate } from '../../../../support/utils/dateUtils';
import {
  MinorCreditorFieldKey,
  resolveEmployerFieldKey,
  resolveCourtFieldKey,
  resolveContactFieldKey,
  resolveMinorCreditorFieldKey,
  resolvePersonalDetailsFieldKey,
  resolveSearchFieldKey,
  resolveSearchResultColumn,
} from '../../../../support/utils/macFieldResolvers';
import { ManualOffenceDetailsLocators as L } from '../../../../shared/selectors/manual-account-creation/offence-details.locators';

export type CompanyAliasRow = { alias: string; name: string };
type LanguagePreferenceLabel = 'Document language' | 'Hearing language';
type OffenceImpositionInput = {
  imposition: number;
  resultCode?: string;
  amountImposed?: string;
  amountPaid?: string;
  creditorType?: string;
  creditorSearch?: string;
};
type MinorCreditorWithBacs = {
  title?: string;
  firstNames?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;
  accountName?: string;
  sortCode?: string;
  accountNumber?: string;
  paymentReference?: string;
};
type MinorCreditorSummary = Partial<{
  'Minor creditor': string;
  Address: string;
  'Payment method': string;
  'Account name': string;
  'Sort code': string;
  'Account number': string;
  'Payment reference': string;
}>;

type ParentGuardianDetailsExpectations = ManualParentGuardianDetailsPayload & {
  addAliasesChecked?: boolean;
};

type CompositeEntry = {
  raw: string[];
  section: string;
  field: string;
  value: string;
  imposition: number;
};

/**
 * Flow for Manual Account Creation.
 *
 * Purpose: encapsulate multi-step journeys across the Manual Account Creation
 * feature so Cucumber steps remain intent-driven and thin.
 */
export class ManualAccountCreationFlow {
  private readonly dashboard = new DashboardActions();
  private readonly createAccount = new ManualCreateAccountActions();
  private readonly accountDetails = new ManualAccountDetailsActions();
  private readonly commentsAndNotes = new ManualAccountCommentsNotesActions();
  private readonly companyDetails = new ManualCompanyDetailsActions();
  private readonly taskNavigation = new ManualAccountTaskNavigationActions();
  private readonly contactDetails = new ManualContactDetailsActions();
  private readonly parentGuardianDetails = new ManualParentGuardianDetailsActions();
  private readonly employerDetails = new ManualEmployerDetailsActions();
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();
  private readonly courtDetails = new ManualCourtDetailsActions();
  private readonly personalDetails = new ManualPersonalDetailsActions();
  private readonly offenceDetails = new ManualOffenceDetailsActions();
  private readonly offenceReview = new ManualOffenceReviewActions();
  private readonly offenceSearch = new ManualOffenceSearchActions();
  private readonly offenceMinorCreditor = new ManualOffenceMinorCreditorActions();
  private readonly paymentTerms = new ManualPaymentTermsActions();
  private readonly languagePreferences = new ManualLanguagePreferencesActions();
  private readonly reviewAccount = new ManualReviewAccountActions();
  private readonly defaultBusinessUnitToken = 'default business unit';

  private isDefaultBusinessUnit(businessUnit: string): boolean {
    return businessUnit.trim().toLowerCase() === this.defaultBusinessUnitToken;
  }

  /**
   * Starts a Fine manual account and lands on the task list.
   * @param businessUnit - Business unit to select.
   * @param defendantType - Defendant type option to choose.
   */
  startFineAccount(businessUnit: string, defendantType: DefendantType): void {
    log('flow', 'Start manual fine account', { businessUnit, defendantType });
    this.ensureOnCreateAccountPage();
    if (!this.isDefaultBusinessUnit(businessUnit)) {
      this.createAccount.selectBusinessUnit(businessUnit);
    }
    this.createAccount.selectAccountType('Fine');
    this.createAccount.selectDefendantType(defendantType);
    this.createAccount.continueToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Completes Court, Offence (single imposition), and Minor Creditor details from one table.
   * @param rows - Raw DataTable rows including headers.
   */
  completeCourtOffenceAndMinorCreditorWithDefaults(rows: string[][]): void {
    if (!rows.length) {
      throw new Error('No data provided for court/offence/minor creditor completion');
    }

    const parseWeeksAgo = (value?: string): number | undefined => {
      if (!value) return undefined;
      const weekMatch = value.match(/(-?\d+)\s*week/i);
      if (weekMatch) return Number(weekMatch[1]);
      const monthMatch = value.match(/(-?\d+)\s*month/i);
      if (monthMatch) return Number(monthMatch[1]) * 4;
      return undefined;
    };

    const [header, ...body] = rows;
    const findIndex = (name: string) => header.findIndex((h) => h?.trim().toLowerCase() === name);
    const sectionIdx = findIndex('section');
    const fieldIdx = findIndex('field');
    const valueIdx = findIndex('value');
    const impositionIdx = findIndex('imposition');

    if (sectionIdx === -1 || fieldIdx === -1 || valueIdx === -1) {
      throw new Error('Table must include Section, Field, and Value columns');
    }

    const entries = body
      .map((row) => ({
        section: row[sectionIdx]?.trim(),
        field: row[fieldIdx]?.trim(),
        value: row[valueIdx]?.trim(),
        imposition: impositionIdx >= 0 ? Number(row[impositionIdx] ?? 1) || 1 : 1,
      }))
      .filter(({ section, field }) => section && field);

    const courtRows = entries.filter(({ section }) => /court/i.test(section));
    const offenceRows = entries.filter(({ section }) => /offence/i.test(section));
    const minorRows = entries.filter(({ section }) => /minor creditor/i.test(section));

    const shouldSelectFirstLja = !courtRows.some(({ field }) => /local justice area|sending area/i.test(field));
    const shouldSelectFirstEnforcement = !courtRows.some(({ field }) => /enforcement court/i.test(field));

    const courtPayload = courtRows.reduce<Partial<Record<ManualCourtFieldKey, string>>>((acc, row) => {
      const key = resolveCourtFieldKey(row.field);
      acc[key] = row.value;
      return acc;
    }, {});

    let offenceCode = offenceRows.find(({ field }) => /offence code/i.test(field ?? ''))?.value?.trim() || 'TP11003';
    let weeksAgo = parseWeeksAgo(offenceRows.find(({ field }) => /date of sentence/i.test(field ?? ''))?.value) ?? 4;

    type ImpositionRow = {
      resultCode?: string;
      amountImposed?: string;
      amountPaid?: string;
      creditorSearch?: string;
      creditorType?: string;
      paymentMethod?: string;
    };

    const impositionMap = new Map<number, ImpositionRow>();
    offenceRows.forEach(({ field, value, imposition }) => {
      const normalized = field.toLowerCase();
      if (/offence code|date of sentence/.test(normalized)) {
        return;
      }
      const bucket = impositionMap.get(imposition) ?? {};
      if (/result code/.test(normalized)) bucket.resultCode = value;
      if (/amount imposed/.test(normalized)) bucket.amountImposed = value;
      if (/amount paid/.test(normalized)) bucket.amountPaid = value;
      if (/creditor type/.test(normalized)) bucket.creditorType = value;
      if (/creditor search/.test(normalized)) bucket.creditorSearch = value;
      if (/payment method/.test(normalized)) bucket.paymentMethod = value;
      impositionMap.set(imposition, bucket);
    });

    if (impositionMap.size === 0) {
      impositionMap.set(1, { creditorType: 'Minor', paymentMethod: 'BACS' });
    }

    const impositions: OffenceImpositionInput[] = Array.from(impositionMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([imposition, payload]) => {
        const defaultCreditor =
          payload.creditorType || (payload.paymentMethod && /bacs/i.test(payload.paymentMethod) ? 'Minor' : undefined);
        return {
          imposition,
          resultCode: payload.resultCode || 'Compensation (FCOMP)',
          amountImposed: payload.amountImposed,
          amountPaid: payload.amountPaid,
          creditorSearch: payload.creditorSearch,
          creditorType: defaultCreditor,
        };
      });

    const minorFields = minorRows.reduce<Partial<Record<MinorCreditorFieldKey, string>>>((acc, row) => {
      if (/payment method|creditor type/i.test(row.field)) {
        return acc;
      }
      const key = resolveMinorCreditorFieldKey(row.field);
      acc[key] = row.value;
      return acc;
    }, {});

    const bacsImpositionFromTable =
      Array.from(impositionMap.entries()).find(([, payload]) => /bacs/i.test(payload.paymentMethod ?? ''))?.[0] || 1;
    const minorImposition =
      minorRows[0]?.imposition ||
      impositions.find(({ creditorType }) => /minor/i.test(creditorType ?? ''))?.imposition ||
      bacsImpositionFromTable ||
      1;

    const bacsRequested =
      /bacs/i.test(impositionMap.get(minorImposition)?.paymentMethod ?? '') ||
      ['accountName', 'sortCode', 'accountNumber', 'paymentReference'].some((key) =>
        Boolean((minorFields as any)[key]),
      );

    const minorPayload: MinorCreditorWithBacs = {
      company: minorFields.company || 'Minor Creditor Ltd',
      address1: minorFields.address1 || 'Addr1',
      address2: minorFields.address2,
      address3: minorFields.address3,
      postcode: minorFields.postcode || 'TE1 1ST',
      accountName: bacsRequested ? minorFields.accountName || 'Minor Creditor' : undefined,
      sortCode: bacsRequested ? minorFields.sortCode || '123456' : undefined,
      accountNumber: bacsRequested ? minorFields.accountNumber || '12345678' : undefined,
      paymentReference: bacsRequested ? minorFields.paymentReference || 'REF' : undefined,
    };

    log('flow', 'Completing Court details from composite table', { courtPayload });
    this.openTaskFromAccountDetails('Court details');
    this.courtDetails.fillCourtDetails(courtPayload);
    if (shouldSelectFirstLja) {
      this.courtDetails.selectFirstLjaOption();
    }
    if (shouldSelectFirstEnforcement) {
      this.courtDetails.selectFirstEnforcementCourtOption();
    }
    this.taskNavigation.returnToAccountDetails();

    log('flow', 'Completing Offence details from composite table', {
      offenceCode,
      weeksAgo,
      impositions,
    });
    this.openTaskFromAccountDetails('Offence details');
    this.addOffenceWithImpositions({ offenceCode, weeksAgo, impositions });

    // Minor creditor: ensure we capture BACS when requested and return to Account details.
    log('flow', 'Completing Company minor creditor with BACS', { minorImposition, minorPayload });
    this.maintainCompanyMinorCreditorWithBacs(minorImposition, minorPayload);
    this.offenceDetails.clickReviewOffence();
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.returnToAccountDetails();
  }

  /**
   * Completes a full manual account setup (Court, Parent/Guardian, Employer, Personal, Offence, Minor Creditor,
   * Payment terms, and Company details) using a single composite table. Sections without rows are skipped.
   * @param rows - Raw DataTable rows including headers.
   */
  completeManualAccountWithDefaults(rows: string[][], accountDetailsHeader?: string): void {
    const entries = this.parseCompositeEntries(rows);
    const courtRows = entries.filter(({ section }) => /court/i.test(section));
    const parentRows = entries.filter(({ section }) => /parent|guardian/i.test(section));
    const employerRows = entries.filter(({ section }) => /employer/i.test(section));
    const personalRows = entries.filter(({ section }) => /personal|defendant/i.test(section));
    const offenceRows = entries.filter(({ section }) => /offence/i.test(section));
    const minorRows = entries.filter(({ section }) => /minor creditor/i.test(section));
    const paymentRows = entries.filter(({ section }) => /payment/i.test(section));
    const companyRows = entries.filter(({ section }) => /company/i.test(section));
    const contactRows = entries.filter(({ section }) => /contact/i.test(section));
    const commentRows = entries.filter(({ section }) => /account\s*comments?|comments?\s*and\s*notes/i.test(section));
    let currentHeader = accountDetailsHeader;
    const companyHeader = this.resolveCompanyHeader(companyRows);
    const personalHeader = this.resolvePersonalHeader(personalRows);

    const handledSection = (section?: string): boolean => {
      if (!section) return false;
      const normalized = section.toLowerCase();
      return (
        /court/.test(normalized) ||
        /parent|guardian/.test(normalized) ||
        /employer/.test(normalized) ||
        /personal|defendant/.test(normalized) ||
        /offence/.test(normalized) ||
        /minor creditor/.test(normalized) ||
        /payment/.test(normalized) ||
        /company/.test(normalized) ||
        /contact/.test(normalized) ||
        /account\s*comments?|comments?\s*and\s*notes/.test(normalized)
      );
    };

    const unhandledSections = Array.from(
      new Set(entries.map(({ section }) => section).filter((section) => !handledSection(section))),
    ).filter(Boolean) as string[];

    if (unhandledSections.length) {
      throw new Error(`Unhandled manual account sections in composite table: ${unhandledSections.join(', ')}`);
    }

    this.handleCourtEntries(courtRows, accountDetailsHeader);

    this.handleParentGuardianEntries(parentRows, accountDetailsHeader);
    this.handleEmployerEntries(employerRows, accountDetailsHeader);
    this.handlePersonalEntries(personalRows, currentHeader);
    if (personalHeader) {
      currentHeader = personalHeader;
    }
    this.handleOffenceAndMinorEntries(offenceRows, minorRows, currentHeader);
    this.handlePaymentEntries(paymentRows, currentHeader);
    this.handleCompanyEntries(companyRows, currentHeader);
    if (companyHeader) {
      currentHeader = companyHeader;
    }
    this.handleContactEntries(contactRows, currentHeader);
    this.handleAccountCommentsEntries(commentRows, currentHeader);
  }

  /**
   * Parses a composite data table into normalized entries with section/field/value/imposition.
   * @param rows - Raw DataTable rows including headers.
   * @returns Array of composite entries with parsed values.
   */
  private parseCompositeEntries(rows: string[][]): CompositeEntry[] {
    if (!rows.length) {
      throw new Error('No data provided for manual account completion');
    }

    const [header, ...body] = rows;
    const findIndex = (name: string) => header.findIndex((h) => h?.trim().toLowerCase() === name);
    const sectionIdx = findIndex('section');
    const fieldIdx = findIndex('field');
    const valueIdx = findIndex('value');
    const impositionIdx = findIndex('imposition');

    if (sectionIdx === -1 || fieldIdx === -1 || valueIdx === -1) {
      throw new Error('Table must include Section, Field, and Value columns');
    }

    const entries: CompositeEntry[] = body
      .map((row) => ({
        raw: row,
        section: row[sectionIdx]?.trim(),
        field: row[fieldIdx]?.trim(),
        value: row[valueIdx]?.trim(),
        imposition: impositionIdx >= 0 ? Number(row[impositionIdx] ?? 1) || 1 : 1,
      }))
      .filter(({ section, field }) => section && field) as CompositeEntry[];

    return entries;
  }

  /**
   * Populates Court details from composite entries and returns to Account details.
   * @param courtRows - Entries scoped to Court details.
   */
  private handleCourtEntries(courtRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!courtRows.length) return;

    const shouldSelectFirstLja = !courtRows.some(({ field }) => /local justice area|sending area/i.test(field));
    const shouldSelectFirstEnforcement = !courtRows.some(({ field }) => /enforcement court/i.test(field));

    const courtPayload = courtRows.reduce<Partial<Record<ManualCourtFieldKey, string>>>((acc, row) => {
      const key = resolveCourtFieldKey(row.field);
      acc[key] = row.value;
      return acc;
    }, {});

    log('flow', 'Completing Court details from composite table', { courtPayload });
    this.provideCourtDetailsFromAccountDetails(courtPayload, accountDetailsHeader);
    if (shouldSelectFirstLja) {
      this.courtDetails.selectFirstLjaOption();
    }
    if (shouldSelectFirstEnforcement) {
      this.courtDetails.selectFirstEnforcementCourtOption();
    }
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Populates Parent/Guardian details (including aliases) from composite entries.
   * @param parentRows - Entries scoped to Parent/Guardian details.
   */
  private handleParentGuardianEntries(parentRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!parentRows.length) return;

    const parentPayload: ManualParentGuardianDetailsPayload = {};
    const ensureAliasEntry = (index: number) => {
      if (!parentPayload.aliases) parentPayload.aliases = [];
      while (parentPayload.aliases.length <= index) {
        parentPayload.aliases.push({});
      }
      return parentPayload.aliases[index] as NonNullable<ManualParentGuardianDetailsPayload['aliases']>[number];
    };

    parentRows.forEach(({ field, value }) => {
      const aliasMatch = field.match(/^alias\s*(\d+)\.(.+)$/i);
      if (aliasMatch) {
        const aliasIndex = Number(aliasMatch[1]) - 1;
        const aliasField = aliasMatch[2].trim().toLowerCase();
        const target = ensureAliasEntry(aliasIndex);
        if (aliasField.startsWith('first')) {
          target.firstNames = value;
        } else if (aliasField.startsWith('last')) {
          target.lastName = value;
        } else {
          throw new Error(`Unsupported parent/guardian alias field: ${field}`);
        }
        return;
      }

      const normalized = field.toLowerCase();
      const compact = normalized.replace(/\s+/g, '');

      if (/add\s*aliases/.test(normalized)) {
        parentPayload.addAliases = /true|yes|1/i.test(value);
        return;
      }
      if (/first name/.test(normalized) || /firstname/.test(compact)) {
        parentPayload.firstNames = value;
        return;
      }
      if (/last name|surname/.test(normalized) || /lastname/.test(compact)) {
        parentPayload.lastName = value;
        return;
      }
      if (/national insurance/.test(normalized) || /nationalinsurance/.test(compact)) {
        parentPayload.nationalInsuranceNumber = value;
        return;
      }
      if (/date of birth|dob/.test(normalized) || /dateofbirth/.test(compact)) {
        parentPayload.dob = value;
        return;
      }
      if (/address line 1/.test(normalized) || /addressline1/.test(compact)) {
        parentPayload.addressLine1 = value;
        return;
      }
      if (/address line 2/.test(normalized) || /addressline2/.test(compact)) {
        parentPayload.addressLine2 = value;
        return;
      }
      if (/address line 3/.test(normalized) || /addressline3/.test(compact)) {
        parentPayload.addressLine3 = value;
        return;
      }
      if (/postcode|post code/.test(normalized) || /postcode/.test(compact)) {
        parentPayload.postcode = value;
        return;
      }
      if (/vehicle make|make and model/.test(normalized)) {
        parentPayload.vehicleMake = value;
        return;
      }
      if (/vehicle registration|registration number/.test(normalized)) {
        parentPayload.vehicleRegistration = value;
      }
    });

    log('flow', 'Completing Parent/Guardian details from composite table', { parentPayload });
    this.openTaskFromAccountDetails('Parent or guardian details', accountDetailsHeader);
    this.fillParentGuardianDetails(parentPayload);
    this.returnToAccountDetailsFromParentGuardian();
  }

  /**
   * Populates Employer details from composite entries and returns to Account details.
   * @param employerRows - Entries scoped to Employer details.
   */
  private handleEmployerEntries(employerRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!employerRows.length) return;

    const employerPayload = employerRows.reduce<Partial<Record<ManualEmployerFieldKey, string>>>((acc, row) => {
      const key = resolveEmployerFieldKey(row.field);
      acc[key] = row.value;
      return acc;
    }, {});

    log('flow', 'Completing Employer details from composite table', { employerPayload });
    this.provideEmployerDetailsFromAccountDetails(employerPayload, accountDetailsHeader);
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Populates Personal details from composite entries and returns to Account details.
   * @param personalRows - Entries scoped to Personal details.
   */
  private handlePersonalEntries(personalRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!personalRows.length) return;

    const personalPayload = personalRows.reduce<ManualPersonalDetailsPayload>((acc, row) => {
      const key = resolvePersonalDetailsFieldKey(row.field);
      (acc as any)[key] = row.value;
      return acc;
    }, {});

    log('flow', 'Completing Personal details from composite table', { personalPayload });
    this.providePersonalDetailsFromAccountDetails(personalPayload, accountDetailsHeader);
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Populates Offence details, impositions, and minor creditor data from composite entries.
   * @param offenceRows - Entries scoped to Offence details.
   * @param minorRows - Entries scoped to Minor creditor details.
   */
  private handleOffenceAndMinorEntries(
    offenceRows: CompositeEntry[],
    minorRows: CompositeEntry[],
    accountDetailsHeader?: string,
  ): void {
    if (!offenceRows.length && !minorRows.length) return;

    const parseWeeksAgo = (value?: string): number | undefined => {
      if (!value) return undefined;
      const weekMatch = value.match(/(-?\d+)\s*week/i);
      if (weekMatch) return Number(weekMatch[1]);
      const monthMatch = value.match(/(-?\d+)\s*month/i);
      if (monthMatch) return Number(monthMatch[1]) * 4;
      return undefined;
    };

    let offenceCode = offenceRows.find(({ field }) => /offence code/i.test(field ?? ''))?.value?.trim() || 'TP11003';
    let weeksAgo = parseWeeksAgo(offenceRows.find(({ field }) => /date of sentence/i.test(field ?? ''))?.value) ?? 4;

    type ImpositionRow = {
      resultCode?: string;
      amountImposed?: string;
      amountPaid?: string;
      creditorType?: string;
      paymentMethod?: string;
    };

    const impositionMap = new Map<number, ImpositionRow>();
    offenceRows.forEach(({ field, value, imposition }) => {
      const normalized = field.toLowerCase();
      if (/offence code|date of sentence/.test(normalized)) {
        return;
      }
      const bucket = impositionMap.get(imposition) ?? {};
      if (/result code/.test(normalized)) bucket.resultCode = value;
      if (/amount imposed/.test(normalized)) bucket.amountImposed = value;
      if (/amount paid/.test(normalized)) bucket.amountPaid = value;
      if (/creditor type/.test(normalized)) bucket.creditorType = value;
      if (/payment method/.test(normalized)) bucket.paymentMethod = value;
      impositionMap.set(imposition, bucket);
    });

    if (impositionMap.size === 0) {
      impositionMap.set(1, { creditorType: 'Minor', paymentMethod: 'BACS' });
    }

    const impositions: OffenceImpositionInput[] = Array.from(impositionMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([imposition, payload]) => {
        const defaultCreditor =
          payload.creditorType || (payload.paymentMethod && /bacs/i.test(payload.paymentMethod) ? 'Minor' : undefined);
        return {
          imposition,
          resultCode: payload.resultCode || 'Compensation (FCOMP)',
          amountImposed: payload.amountImposed,
          amountPaid: payload.amountPaid,
          creditorType: defaultCreditor,
        };
      });

    const minorFields = minorRows.reduce<Partial<Record<MinorCreditorFieldKey, string>>>((acc, row) => {
      if (/payment method|creditor type/i.test(row.field)) {
        return acc;
      }
      const key = resolveMinorCreditorFieldKey(row.field);
      acc[key] = row.value;
      return acc;
    }, {});

    const bacsImpositionFromTable =
      Array.from(impositionMap.entries()).find(([, payload]) => /bacs/i.test(payload.paymentMethod ?? ''))?.[0] || 1;
    const minorImposition =
      minorRows[0]?.imposition ||
      impositions.find(({ creditorType }) => /minor/i.test(creditorType ?? ''))?.imposition ||
      bacsImpositionFromTable ||
      1;

    const bacsRequested =
      /bacs/i.test(impositionMap.get(minorImposition)?.paymentMethod ?? '') ||
      ['accountName', 'sortCode', 'accountNumber', 'paymentReference'].some((key) =>
        Boolean((minorFields as any)[key]),
      );

    const minorPayload: MinorCreditorWithBacs = {
      company: minorFields.company || 'Minor Creditor Ltd',
      address1: minorFields.address1 || 'Addr1',
      address2: minorFields.address2,
      address3: minorFields.address3,
      postcode: minorFields.postcode || 'TE1 1ST',
      accountName: bacsRequested ? minorFields.accountName || 'Minor Creditor' : undefined,
      sortCode: bacsRequested ? minorFields.sortCode || '123456' : undefined,
      accountNumber: bacsRequested ? minorFields.accountNumber || '12345678' : undefined,
      paymentReference: bacsRequested ? minorFields.paymentReference || 'REF' : undefined,
    };

    log('flow', 'Completing Offence details from composite table', {
      offenceCode,
      weeksAgo,
      impositions,
    });
    this.openTaskFromAccountDetails('Offence details', accountDetailsHeader);
    this.addOffenceWithImpositions({ offenceCode, weeksAgo, impositions });

    log('flow', 'Completing Company minor creditor with BACS', { minorImposition, minorPayload });
    this.maintainCompanyMinorCreditorWithBacs(minorImposition, minorPayload);
    this.offenceDetails.clickReviewOffence();
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.returnToAccountDetails();
  }

  /**
   * Populates Payment terms from composite entries and returns to Account details.
   * @param paymentRows - Entries scoped to Payment terms.
   */
  private handlePaymentEntries(paymentRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!paymentRows.length) return;

    const payload: ManualPaymentTermsInput = {};

    const toBoolean = (value?: string): boolean | undefined => {
      if (value === undefined) return undefined;
      const normalized = value.trim().toLowerCase();
      if (normalized === '') return undefined;
      if (['yes', 'y', 'true', 'checked', 'selected'].includes(normalized)) return true;
      if (['no', 'n', 'false', 'unchecked', 'not selected'].includes(normalized)) return false;
      return undefined;
    };

    const resolveDateValue = (value?: string): string | undefined => {
      if (value === undefined) return undefined;
      const trimmed = value.trim();
      if (trimmed === '') return '';
      if (/week/i.test(trimmed)) {
        return resolveRelativeDate(trimmed);
      }
      return trimmed;
    };

    const mapPaymentTerm = (value?: string): PaymentTermOption | undefined => {
      if (!value) return undefined;
      const normalized = value.trim().toLowerCase();
      if (normalized === '') return undefined;
      if (/pay in full/i.test(normalized)) return 'Pay in full';
      if (/instalments only/i.test(normalized)) return 'Instalments only';
      if (/lump sum plus instalments/i.test(normalized)) return 'Lump sum plus instalments';
      return undefined;
    };

    const mapFrequency = (value?: string): PaymentFrequencyOption | undefined => {
      if (!value) return undefined;
      const normalized = value.trim().toLowerCase();
      if (normalized === '') return undefined;
      if (/weekly/i.test(normalized)) return 'Weekly';
      if (/fortnightly/i.test(normalized)) return 'Fortnightly';
      if (/monthly/i.test(normalized)) return 'Monthly';
      return undefined;
    };

    const mapEnforcementOption = (value?: string): EnforcementActionOption | undefined => {
      if (!value) return undefined;
      const normalized = value.trim().toLowerCase();
      if (normalized === '') return undefined;
      if (/noenf|hold enforcement/i.test(normalized)) return 'Hold enforcement on account (NOENF)';
      if (/prison|pris/i.test(normalized)) return 'Prison (PRIS)';
      return undefined;
    };

    paymentRows.forEach(({ field, value }) => {
      const normalizedField = field.toLowerCase();
      if (/collection order/.test(normalizedField) && !/today/.test(normalizedField)) {
        if (value) {
          payload.collectionOrder = value.trim().toLowerCase() === 'yes' ? 'Yes' : 'No';
        }
        return;
      }
      if (/collection order today/.test(normalizedField)) {
        const boolVal = toBoolean(value);
        if (boolVal !== undefined) payload.collectionOrderToday = boolVal;
        return;
      }
      if (/collection order date/.test(normalizedField)) {
        const resolved = resolveDateValue(value);
        if (resolved !== undefined) payload.collectionOrderDate = resolved;
        return;
      }
      if (/payment term/.test(normalizedField)) {
        const term = mapPaymentTerm(value);
        if (term) payload.paymentTerm = term;
        return;
      }
      if (/pay in full by/.test(normalizedField)) {
        const resolved = resolveDateValue(value);
        if (resolved !== undefined) payload.payByDate = resolved;
        return;
      }
      if (/lump sum/.test(normalizedField)) {
        payload.lumpSumAmount = value;
        return;
      }
      if (/instalment/.test(normalizedField)) {
        payload.instalmentAmount = value;
        return;
      }
      if (/frequency/.test(normalizedField)) {
        const freq = mapFrequency(value);
        if (freq) payload.frequency = freq;
        return;
      }
      if (/start date/.test(normalizedField)) {
        const resolved = resolveDateValue(value);
        if (resolved !== undefined) payload.startDate = resolved;
        return;
      }
      if (/request payment card/.test(normalizedField)) {
        const boolVal = toBoolean(value);
        if (boolVal !== undefined) payload.requestPaymentCard = boolVal;
        return;
      }
      if (/days in default/.test(normalizedField) && !/date/.test(normalizedField)) {
        const boolVal = toBoolean(value);
        if (boolVal !== undefined) payload.hasDaysInDefault = boolVal;
        return;
      }
      if (/date days in default were imposed/.test(normalizedField)) {
        const resolved = resolveDateValue(value);
        if (resolved !== undefined) payload.daysInDefaultDate = resolved;
        return;
      }
      if (/default days|days in default input field|days in default count/.test(normalizedField)) {
        payload.defaultDays = value;
        return;
      }
      if (/add enforcement action/.test(normalizedField)) {
        const boolVal = toBoolean(value);
        if (boolVal !== undefined) payload.addEnforcementAction = boolVal;
        return;
      }
      if (/enforcement action/.test(normalizedField)) {
        const option = mapEnforcementOption(value);
        if (option) payload.enforcementOption = option;
        return;
      }
      if (/enforcement reason|reason account is on noenf|reason/.test(normalizedField)) {
        payload.enforcementReason = value;
      }
    });

    log('flow', 'Completing Payment terms from composite table', { payload });
    this.providePaymentTermsFromAccountDetails(payload, accountDetailsHeader);
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Populates Contact details from composite entries and returns to Account details.
   * @param contactRows - Entries scoped to Contact details.
   * @param accountDetailsHeader - Header to assert on Account details (falls back to default when omitted).
   */
  private handleContactEntries(contactRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!contactRows.length) return;

    const payload = contactRows.reduce<Partial<Record<ManualContactFieldKey, string>>>((acc, row) => {
      if (!row.field) return acc;
      const key = resolveContactFieldKey(row.field);
      acc[key] = row.value;
      return acc;
    }, {});

    log('flow', 'Completing Contact details from composite table', { payload, accountDetailsHeader });
    this.openTaskFromAccountDetails('Contact details', accountDetailsHeader);
    this.contactDetails.fillContactDetails(payload);
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Resolves the Account details header after company details updates.
   * @param companyRows - Entries scoped to Company details.
   */
  private resolveCompanyHeader(companyRows: CompositeEntry[]): string | undefined {
    const companyName = companyRows.find(({ field }) => /company name/i.test(field ?? ''))?.value?.trim();
    return companyName || undefined;
  }

  /**
   * Resolves the Account details header after personal details updates.
   * @param personalRows - Entries scoped to Personal/Defendant details.
   */
  private resolvePersonalHeader(personalRows: CompositeEntry[]): string | undefined {
    const first = personalRows.find(({ field }) => /first name|forename/i.test(field ?? ''))?.value?.trim();
    const last = personalRows.find(({ field }) => /last name|surname/i.test(field ?? ''))?.value?.trim();
    if (!first && !last) return undefined;

    if (first && last) return `${first} ${last}`.trim();
    return (first || last)?.trim();
  }

  /**
   * Populates Company details (including aliases) from composite entries and returns to Account details.
   * @param companyRows - Entries scoped to Company details.
   */
  private handleCompanyEntries(companyRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!companyRows.length) return;

    const companyData: Record<string, string> = {};
    const aliases: CompanyAliasRow[] = [];

    companyRows.forEach(({ field, value }) => {
      const normalized = field.toLowerCase();
      const aliasMatch = normalized.match(/alias\s*(\d+)/);
      if (aliasMatch) {
        aliases.push({ alias: aliasMatch[1], name: value });
        return;
      }
      if (/company name/.test(normalized)) {
        companyData['company name'] = value;
        return;
      }
      if (/address line 1/.test(normalized)) {
        companyData['address line 1'] = value;
        return;
      }
      if (/address line 2/.test(normalized)) {
        companyData['address line 2'] = value;
        return;
      }
      if (/address line 3/.test(normalized)) {
        companyData['address line 3'] = value;
        return;
      }
      if (/postcode/.test(normalized)) {
        companyData['postcode'] = value;
      }
    });

    log('flow', 'Completing Company details from composite table', { companyData, aliases });
    this.openTaskFromAccountDetails('Company details', accountDetailsHeader);
    if (Object.keys(companyData).length) {
      this.fillCompanyDetailsFromTable(companyData);
    }
    if (aliases.length) {
      this.addCompanyAliases(aliases);
    }
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Populates Account comments and notes from composite entries and returns to Account details.
   * @param commentRows - Entries scoped to Account comments and notes.
   * @param accountDetailsHeader - Header to assert on Account details (falls back to default when omitted).
   */
  private handleAccountCommentsEntries(commentRows: CompositeEntry[], accountDetailsHeader?: string): void {
    if (!commentRows.length) return;

    let comment = '';
    let note = '';

    commentRows.forEach(({ field, value }) => {
      const normalizedField = (field ?? '').toLowerCase();
      if (/comment/.test(normalizedField)) {
        comment = value ?? '';
        return;
      }
      if (/note/.test(normalizedField)) {
        note = value ?? '';
      }
    });

    log('flow', 'Completing Account comments and notes from composite table', {
      comment,
      note,
      accountDetailsHeader,
    });
    this.provideAccountCommentsAndNotes(comment, note, accountDetailsHeader);
  }

  /**
   * Starts a fine manual account and opens the requested task.
   * @param businessUnit - Business unit to select.
   * @param defendantType - Defendant type option to choose.
   * @param taskName - Task to open after creation.
   */
  startFineAccountAndOpenTask(
    businessUnit: string,
    defendantType: DefendantType,
    taskName: ManualAccountTaskName,
  ): void {
    log('flow', 'Start fine account and open task', { businessUnit, defendantType, taskName });
    this.startFineAccount(businessUnit, defendantType);
    this.openTaskFromAccountDetails(taskName);
  }

  /**
   * Reloads the create account page and restarts manual account creation.
   * @param businessUnit - Business unit to reselect.
   * @param accountType - Account type to choose.
   * @param defendantType - Defendant type to choose.
   */
  restartManualAccount(businessUnit: string, accountType: AccountType, defendantType: DefendantType): void {
    log('flow', 'Restart manual account after refresh', { businessUnit, accountType, defendantType });
    cy.reload();
    this.createAccount.assertOnCreateAccountPage();
    if (!this.isDefaultBusinessUnit(businessUnit)) {
      this.createAccount.selectBusinessUnit(businessUnit);
    }
    this.createAccount.selectAccountType(accountType);
    this.createAccount.selectDefendantType(defendantType);
    this.goToAccountDetails();
  }

  /**
   * Continues from the create account page to the account details task list.
   */
  goToAccountDetails(): void {
    log('flow', 'Continue to account details task list');
    this.createAccount.continueToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Opens the Language preferences change link from Account details and asserts the destination page.
   * @param label - The language row to open (Document language or Hearing language).
   */
  openLanguagePreferencesFromAccountDetails(label: LanguagePreferenceLabel): void {
    log('flow', 'Opening language preferences from Account details', { label });
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openLanguagePreference(label);
    this.languagePreferences.assertOnLanguagePreferencesPage();
  }

  /**
   * Updates language preferences while on the Language preferences page.
   * @param payload - Document and hearing language selections.
   */
  setLanguagePreferences(payload: Partial<Record<LanguagePreferenceLabel, LanguageOption>>): void {
    const document = payload['Document language'] ?? (payload as any).document;
    const hearing = payload['Hearing language'] ?? (payload as any).hearing;

    log('flow', 'Setting language preferences', { document, hearing });
    this.languagePreferences.assertOnLanguagePreferencesPage();

    if (document) {
      this.languagePreferences.selectLanguage('Documents', document);
    }

    if (hearing) {
      this.languagePreferences.selectLanguage('Court hearings', hearing);
    }
  }

  /**
   * Asserts language selections on the Language preferences page.
   * @param expectations - Expected selections for document/hearing.
   */
  assertLanguageSelections(expectations: Partial<Record<LanguagePreferenceLabel, LanguageOption>>): void {
    const document = expectations['Document language'] ?? (expectations as any).document;
    const hearing = expectations['Hearing language'] ?? (expectations as any).hearing;

    log('assert', 'Asserting language selections', { document, hearing });
    this.languagePreferences.assertOnLanguagePreferencesPage();

    if (document) {
      this.languagePreferences.assertLanguageSelected('Documents', document, true);
    }
    if (hearing) {
      this.languagePreferences.assertLanguageSelected('Court hearings', hearing, true);
    }
  }

  /**
   * Saves language preferences and asserts return to Account details.
   */
  saveLanguagePreferencesAndReturn(): void {
    log('flow', 'Saving language preferences and returning to Account details');
    this.languagePreferences.saveChanges();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Cancels language preferences with a chosen dialog response.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelLanguagePreferences(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancelling language preferences', { choice });
    this.languagePreferences.assertOnLanguagePreferencesPage();
    this.languagePreferences.cancelAndChoose(choice);
  }

  /**
   * Cancels language preferences, confirms leaving, and asserts Account details is shown.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelLanguagePreferencesAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancelling language preferences and returning to Account details', { choice });
    this.cancelLanguagePreferences(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Opens a task from account details and asserts the destination page.
   * @param taskName - Task list entry to open.
   */
  openTaskFromAccountDetails(taskName: ManualAccountTaskName, expectedHeader?: string): void {
    const normalizedTask = (taskName ?? '').trim() as ManualAccountTaskName;
    this.accountDetails.assertOnAccountDetailsPage(expectedHeader);
    this.accountDetails.openTask(normalizedTask);

    if (normalizedTask === 'Company details') {
      this.companyDetails.assertOnCompanyDetailsPage();
      return;
    }

    if (normalizedTask === 'Account comments and notes') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', 'account-comments');
      this.commentsAndNotes.assertHeader();
      return;
    }

    if (normalizedTask === 'Contact details') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
      this.contactDetails.assertOnContactDetailsPage();
      return;
    }

    if (normalizedTask === 'Personal details') {
      this.personalDetails.assertOnPersonalDetailsPage();
      return;
    }

    if (normalizedTask === 'Parent or guardian details') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/parent-guardian-details');
      this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
      return;
    }

    if (normalizedTask === 'Employer details') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/employer-details');
      this.employerDetails.assertOnEmployerDetailsPage();
      return;
    }

    if (normalizedTask === 'Payment terms') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/payment-terms');
      this.paymentTerms.assertOnPaymentTermsPage();
      return;
    }

    if (normalizedTask === 'Court details') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/court-details');
      this.courtDetails.assertOnCourtDetailsPage();
      return;
    }
  }

  /**
   * Opens the Account comments and notes task, sets values, and returns to the task list.
   * @param comment - Comment text to enter.
   * @param note - Note text to enter.
   * @param accountDetailsHeader - Optional Account details header to assert before opening the task.
   */
  provideAccountCommentsAndNotes(comment: string, note: string, accountDetailsHeader?: string): void {
    log('flow', 'Provide account comments and notes', { comment, note, accountDetailsHeader });
    this.openTaskFromAccountDetails('Account comments and notes', accountDetailsHeader);
    this.commentsAndNotes.setComment(comment);
    this.commentsAndNotes.setNote(note);
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Opens Account comments and notes, sets values, and stays on the task.
   * @param comment - Comment text to enter.
   * @param note - Note text to enter.
   */
  setAccountCommentsAndNotes(comment: string, note: string): void {
    log('flow', 'Set account comments and notes on task', { comment, note });
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.setComment(comment);
    this.commentsAndNotes.setNote(note);
  }

  /**
   * Opens the Account comments and notes task and asserts the header.
   */
  viewAccountCommentsAndNotes(): void {
    log('flow', 'View Account comments and notes task');
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.assertHeader();
  }

  /**
   * Opens the Company details task and asserts the destination.
   */
  openCompanyDetailsTask(): void {
    log('flow', 'Opening Company details task');
    this.accountDetails.openTask('Company details');
    this.companyDetails.assertOnCompanyDetailsPage();
  }

  /**
   * @description Opens the Parent or guardian details task and asserts the page.
   * @example
   *  flow.openParentGuardianDetailsTask();
   */
  openParentGuardianDetailsTask(): void {
    log('flow', 'Opening Parent/Guardian details task');
    this.openTaskFromAccountDetails('Parent or guardian details');
  }

  /**
   * @description Fills Parent/Guardian details using the provided payload.
   * @param payload - Field/value map including optional aliases.
   * @example
   *  flow.fillParentGuardianDetails({ firstNames: 'FNAME', lastName: 'LNAME' });
   */
  fillParentGuardianDetails(payload: ManualParentGuardianDetailsPayload): void {
    log('flow', 'Filling Parent/Guardian details form', { payload });
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
    this.parentGuardianDetails.fillParentGuardianDetails(payload);
  }

  /**
   * @description Asserts Parent/Guardian details match expectations.
   * @param expected - Expected field values (aliases optional).
   * @example
   *  flow.assertParentGuardianDetails({ firstNames: 'FNAME', addAliasesChecked: true });
   */
  assertParentGuardianDetails(expected: ParentGuardianDetailsExpectations): void {
    log('assert', 'Asserting Parent/Guardian details', { expected });
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();

    const addAliases = expected.addAliasesChecked ?? expected.addAliases;
    if (addAliases !== undefined) {
      this.parentGuardianDetails.assertAddAliasesChecked(Boolean(addAliases));
    }

    if (expected.firstNames !== undefined) {
      this.parentGuardianDetails.assertFieldValue('firstNames', expected.firstNames);
    }

    if (expected.lastName !== undefined) {
      this.parentGuardianDetails.assertFieldValue('lastName', expected.lastName);
    }

    if (expected.dob !== undefined) {
      this.parentGuardianDetails.assertFieldValue('dob', expected.dob);
    }

    if (expected.nationalInsuranceNumber !== undefined) {
      this.parentGuardianDetails.assertFieldValue('nationalInsuranceNumber', expected.nationalInsuranceNumber ?? '');
    }

    if (expected.addressLine1 !== undefined) {
      this.parentGuardianDetails.assertFieldValue('addressLine1', expected.addressLine1);
    }

    if (expected.addressLine2 !== undefined) {
      this.parentGuardianDetails.assertFieldValue('addressLine2', expected.addressLine2);
    }

    if (expected.addressLine3 !== undefined) {
      this.parentGuardianDetails.assertFieldValue('addressLine3', expected.addressLine3);
    }

    if (expected.postcode !== undefined) {
      this.parentGuardianDetails.assertFieldValue('postcode', expected.postcode);
    }

    if (expected.vehicleMake !== undefined) {
      this.parentGuardianDetails.assertFieldValue('vehicleMake', expected.vehicleMake);
    }

    if (expected.vehicleRegistration !== undefined) {
      this.parentGuardianDetails.assertFieldValue('vehicleRegistration', expected.vehicleRegistration);
    }

    expected.aliases?.forEach((alias, index) => {
      if (alias.firstNames !== undefined) {
        this.parentGuardianDetails.assertAliasFieldValue(index, 'firstNames', alias.firstNames);
      }
      if (alias.lastName !== undefined) {
        this.parentGuardianDetails.assertAliasFieldValue(index, 'lastName', alias.lastName);
      }
    });
  }

  /**
   * @description Asserts an inline validation error on the Parent/Guardian form.
   * @param field - Field key to target.
   * @param expected - Expected error text.
   * @example
   *  flow.assertParentGuardianInlineError('firstNames', "Enter parent or guardian's first name(s)");
   */
  assertParentGuardianInlineError(field: ManualParentGuardianFieldKey, expected: string): void {
    log('assert', 'Asserting Parent/Guardian inline error', { field, expected });
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
    this.parentGuardianDetails.assertInlineError(field, expected);
  }

  /**
   * @description Returns to the Account details task list from Parent/Guardian.
   * @example
   *  flow.returnToAccountDetailsFromParentGuardian();
   */
  returnToAccountDetailsFromParentGuardian(): void {
    log('flow', 'Returning to Account details from Parent/Guardian task');
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
    this.parentGuardianDetails.returnToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
  }

  /**
   * @description Clicks Return to account details without asserting navigation (useful for validation flows).
   * @example
   *  flow.submitParentGuardianWithoutNavigation();
   */
  submitParentGuardianWithoutNavigation(): void {
    log('flow', 'Submitting Parent/Guardian form without navigation assertion');
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
    this.parentGuardianDetails.returnToAccountDetails();
  }

  /**
   * @description Navigates to Contact details using the nested CTA on Parent/Guardian details.
   * @param expectedHeader - Expected Contact details header text.
   * @example
   *  flow.continueToContactDetailsFromParentGuardian('Parent or guardian contact details');
   */
  continueToContactDetailsFromParentGuardian(expectedHeader: string = 'Parent or guardian contact details'): void {
    log('flow', 'Continuing to Contact details from Parent/Guardian task', { expectedHeader });
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
    this.parentGuardianDetails.addContactDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
    this.contactDetails.assertOnContactDetailsPage(expectedHeader);
  }

  /**
   * @description Cancels the Parent/Guardian form and chooses confirm dialog response.
   * @param choice - Choose "Ok" to leave or "Cancel" to stay.
   * @example
   *  flow.cancelParentGuardianDetails('Ok');
   */
  cancelParentGuardianDetails(choice: 'Ok' | 'Cancel'): void {
    log('flow', 'Cancelling Parent/Guardian details', { choice });
    this.parentGuardianDetails.assertOnParentGuardianDetailsPage();
    this.parentGuardianDetails.cancelAndChoose(choice);
  }

  /**
   * Navigates from the dashboard to the Manual Account Creation start page.
   * Asserts both the dashboard and the target page.
   */
  goToManualAccountCreationFromDashboard(): void {
    log('flow', 'Navigate to Manual Account Creation from dashboard');
    this.dashboard.assertDashboard();
    this.ensureOnCreateAccountPage();
  }

  /**
   * From Account comments and notes, continue to Review and submit and assert the destination header.
   * @param expectedHeader - Header text expected on the review page.
   */
  proceedToReviewFromComments(expectedHeader: string): void {
    log('flow', 'Proceed to review from comments and notes', { expectedHeader });
    this.commentsAndNotes.assertReviewAndSubmitVisible();
    this.commentsAndNotes.clickReviewAndSubmit();
    cy.location('pathname', { timeout: this.pathTimeout }).should((path) => {
      expect(path).to.match(/(check-account|review-account)/i);
    });
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Asserts both comment and note values on the Account comments and notes task.
   * @param comment - Expected comment text.
   * @param note - Expected note text.
   */
  assertAccountCommentsAndNotes(comment: string, note: string): void {
    log('flow', 'Asserting account comments and notes values', { comment, note });
    this.commentsAndNotes.assertCommentValue(comment);
    this.commentsAndNotes.assertNoteValue(note);
  }

  /**
   * Returns to Account details and asserts the requested task status.
   * @param taskName - Task to check.
   * @param expectedStatus - Expected status string.
   */
  returnToAccountDetailsAndAssertStatus(taskName: ManualAccountTaskName, expectedStatus: string): void {
    log('flow', 'Return to account details and assert task status', { taskName, expectedStatus });
    this.taskNavigation.returnToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertTaskStatus(taskName, expectedStatus);
  }

  /**
   * Provides court details by opening the task from Account details.
   * @param payload - Court details key/value map.
   */
  provideCourtDetailsFromAccountDetails(
    payload: Partial<Record<ManualCourtFieldKey, string>>,
    accountDetailsHeader?: string,
  ): void {
    log('flow', 'Provide court details from Account details', { payload, accountDetailsHeader });
    this.openTaskFromAccountDetails('Court details', accountDetailsHeader);
    this.courtDetails.fillCourtDetails(payload);
  }

  /**
   * Completes Court details assuming navigation is handled by the caller.
   * @param lja - Local justice area code.
   * @param pcr - Prosecutor case reference.
   * @param enforcementCourt - Enforcement court value.
   */
  completeCourtDetails(lja: string, pcr: string, enforcementCourt: string): void {
    log('flow', 'Complete court details (navigation handled by caller)', { lja, pcr, enforcementCourt });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.fillCourtDetails({ lja, pcr, enforcementCourt });
  }

  /**
   * Provides employer details by opening the task from Account details.
   * @param payload - Employer details key/value map.
   */
  provideEmployerDetailsFromAccountDetails(
    payload: Partial<Record<ManualEmployerFieldKey, string>>,
    accountDetailsHeader?: string,
  ): void {
    log('flow', 'Provide employer details from Account details', { payload, accountDetailsHeader });
    this.openTaskFromAccountDetails('Employer details', accountDetailsHeader);
    this.employerDetails.fillEmployerDetails(payload);
  }

  /**
   * Completes Employer details assuming navigation is handled by the caller.
   * @param payload - Employer details key/value map.
   */
  completeEmployerDetails(payload: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Complete employer details (navigation handled by caller)', { payload });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.fillEmployerDetails(payload);
  }

  /**
   * Asserts Employer details field values on the task.
   * @param expected - Field/value pairs to assert.
   */
  assertEmployerDetailsFields(expected: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Asserting Employer details field values', { expected });
    this.employerDetails.assertOnEmployerDetailsPage();
    Object.entries(expected).forEach(([field, value]) => {
      this.employerDetails.assertFieldValue(field as ManualEmployerFieldKey, value as string);
    });
  }

  /**
   * Cancels out of Employer details with a given choice.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelEmployerDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Employer details', { choice });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.cancelAndChoose(choice);
  }

  /**
   * Cancels Employer details and asserts return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelEmployerDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Employer details and return to Account details', { choice });
    this.cancelEmployerDetails(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates from Employer details to Offence details using the nested CTA.
   * @param expectedHeader - Header text expected on Offence details.
   */
  continueToOffenceDetailsFromEmployer(expectedHeader: string = 'Add an offence'): void {
    log('flow', 'Continue to Offence details from Employer details', { expectedHeader });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.clickNestedFlowButton('Add offence details');
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/offence-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Asserts Court details field values on the task.
   * @param expected - Field/value pairs to assert.
   */
  assertCourtDetailsFields(expected: Partial<Record<ManualCourtFieldKey, string>>): void {
    log('flow', 'Asserting Court details field values', { expected });
    this.courtDetails.assertOnCourtDetailsPage();

    if (expected.lja !== undefined) {
      this.courtDetails.assertFieldValue('lja', expected.lja);
    }
    if (expected.pcr !== undefined) {
      this.courtDetails.assertFieldValue('pcr', expected.pcr);
    }
    if (expected.enforcementCourt !== undefined) {
      this.courtDetails.assertFieldValue('enforcementCourt', expected.enforcementCourt);
    }
  }

  /**
   * Cancels out of Court details with a given choice.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelCourtDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Court details', { choice });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.cancelAndChoose(choice);
  }

  /**
   * Cancels Court details and asserts return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelCourtDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Court details and return to Account details', { choice });
    this.cancelCourtDetails(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates to Personal details via the Court details nested CTA.
   * @param expectedHeader - Header text expected on Personal details.
   */
  continueToPersonalDetailsFromCourt(expectedHeader: string = 'Personal details'): void {
    log('flow', 'Continue to Personal details from Court details', { expectedHeader });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.clickNestedFlowButton('Add personal details');
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/personal-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Provides personal details from the Account details task list.
   * @param payload - Personal details values to populate.
   */
  providePersonalDetailsFromAccountDetails(payload: ManualPersonalDetailsPayload, accountDetailsHeader?: string): void {
    log('flow', 'Provide personal details from Account details', { payload, accountDetailsHeader });
    this.accountDetails.assertOnAccountDetailsPage(accountDetailsHeader);
    this.accountDetails.openTask('Personal details');
    this.personalDetails.assertOnPersonalDetailsPage();
    this.personalDetails.fillPersonalDetails(payload);
  }

  /**
   * Completes personal details assuming navigation is handled by the caller.
   * @param payload - Personal details values to populate.
   */
  completePersonalDetails(payload: ManualPersonalDetailsPayload): void {
    log('flow', 'Complete personal details (navigation handled by caller)', payload);
    this.personalDetails.assertOnPersonalDetailsPage();
    this.personalDetails.fillPersonalDetails(payload);
  }

  /**
   * @description Continues from Personal details to Contact details using the nested CTA.
   * @param expectedHeader - Header text expected on Contact details.
   * @example
   *  flow.continueToContactDetailsFromPersonalDetails('Defendant contact details');
   */
  continueToContactDetailsFromPersonalDetails(expectedHeader: string = 'Defendant contact details'): void {
    log('flow', 'Continue to Contact details from Personal details', { expectedHeader });
    this.personalDetails.assertOnPersonalDetailsPage();
    this.personalDetails.clickAddContactDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
    this.contactDetails.assertOnContactDetailsPage(expectedHeader);
  }

  /**
   * @description Asserts Personal details fields against expected values.
   * @param expected - Field/value pairs to verify.
   * @example
   *  flow.assertPersonalDetailsFields({ firstNames: 'FNAME' });
   */
  assertPersonalDetailsFields(expected: Partial<Record<ManualPersonalDetailsFieldKey, string>>): void {
    log('assert', 'Asserting personal details fields', { expected });
    this.personalDetails.assertOnPersonalDetailsPage();
    Object.entries(expected).forEach(([field, value]) => {
      this.personalDetails.assertFieldValue(field as ManualPersonalDetailsFieldKey, value as string);
    });
  }

  /**
   * Provides offence details from Account details and submits for review.
   * @param payload - Offence details and imposition values.
   */
  provideOffenceDetailsFromAccountDetails(payload: {
    dateOfSentence: string;
    offenceCode: string;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
  }): void {
    log('flow', 'Provide offence details from Account details', payload);
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openTask('Offence details');
    this.offenceDetails.fillOffenceDetails(payload);
    this.offenceDetails.clickReviewOffence();
  }

  /**
   * Adds impositions (financials + creditor types) for an offence and sets offence details.
   * @param payload - Offence code, relative sentence weeks, and imposition rows.
   */
  addOffenceWithImpositions(payload: {
    offenceCode: string;
    weeksAgo: number;
    impositions: OffenceImpositionInput[];
  }): void {
    const { offenceCode, weeksAgo } = payload;
    const impositions = [...payload.impositions].sort((a, b) => a.imposition - b.imposition);
    const dateOfSentence = calculateWeeksInPast(weeksAgo);

    log('flow', 'Adding offence with impositions and creditor types', {
      offenceCode,
      weeksAgo,
      impositionCount: impositions.length,
    });

    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.setOffenceField('Offence code', offenceCode);
    this.offenceDetails.setOffenceField('Date of sentence', dateOfSentence);

    let chain = cy.wrap(0);

    impositions.forEach((row: OffenceImpositionInput) => {
      const index = Number(row.imposition) - 1;
      if (Number.isNaN(index) || index < 0) {
        throw new Error(`Invalid imposition index: ${row.imposition}`);
      }

      chain = chain
        .then(() => this.ensureImpositionIndex(index))
        .then(() => {
          if (row.resultCode !== undefined) {
            this.offenceDetails.setImpositionField(index, 'Result code', row.resultCode);
          }
          if (row.amountImposed !== undefined) {
            this.offenceDetails.setImpositionField(index, 'Amount imposed', row.amountImposed);
          }
          if (row.amountPaid !== undefined) {
            this.offenceDetails.setImpositionField(index, 'Amount paid', row.amountPaid);
          }

          const type = (row.creditorType || '').toLowerCase();
          if (type.includes('major')) {
            this.offenceDetails.selectCreditorType(index, 'major');
            if (row.creditorSearch) {
              this.offenceDetails.setMajorCreditor(index, row.creditorSearch);
            }
          } else if (type.includes('minor')) {
            this.offenceDetails.selectCreditorType(index, 'minor');
          }
        });
    });

    chain.then(() => undefined);
  }

  /**
   * Asserts the offence details page header and supporting text.
   * @param header - Expected header text.
   * @param text - Supporting text to assert is visible.
   */
  assertOffenceDetailsPage(header: string, text: string): void {
    log('assert', 'Asserting offence details page header/text', { header, text });
    this.offenceDetails.assertOnAddOffencePage(header);
    cy.contains(text).should('exist');
  }

  /**
   * Completes basic offence details with a single imposition (amounts only).
   * @param payload - Weeks offset and offence/imposition values.
   */
  completeOffenceWithAmounts(payload: {
    weeksInPast: number;
    offenceCode: string;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
  }): void {
    const { weeksInPast, offenceCode, resultCode, amountImposed, amountPaid } = payload;
    const dateOfSentence = calculateWeeksInPast(weeksInPast);
    log('flow', 'Completing offence details with amounts', {
      ...payload,
      dateOfSentence,
    });
    this.accountDetails.assertOnAccountDetailsPage();
    this.offenceDetails.fillOffenceDetails({
      dateOfSentence,
      offenceCode,
      resultCode,
      amountImposed,
      amountPaid,
    });
  }

  /**
   * Sets offence code and sentence date based on a weeks offset.
   * @param offenceCode - Offence code to enter.
   * @param weeks - Weeks in the past to calculate sentence date.
   */
  setOffenceDetailsWithSentenceWeeksAgo(offenceCode: string, weeks: number): void {
    const dateOfSentence = calculateWeeksInPast(weeks);
    log('flow', 'Setting offence details (code + sentence date)', { offenceCode, weeks, dateOfSentence });
    this.offenceDetails.setOffenceField('Offence code', offenceCode);
    this.offenceDetails.setOffenceField('Date of sentence', dateOfSentence);
  }

  /**
   * Adds an offence with impositions then cancels back to the offence page.
   * @param payload - Offence code, weeks offset, and impositions.
   */
  addOffenceWithImpositionsAndCancel(payload: {
    offenceCode: string;
    weeksAgo: number;
    impositions: OffenceImpositionInput[];
  }): void {
    log('flow', 'Adding offence with impositions then cancelling', payload);
    this.addOffenceWithImpositions(payload);
    this.offenceDetails.cancelOffenceDetails('Cancel');
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Reviews the current offence and asserts the review page is shown.
   */
  reviewOffenceAndAssertReviewPage(): void {
    log('flow', 'Reviewing offence and asserting review page');
    this.offenceDetails.clickReviewOffence();
    this.offenceReview.assertOnReviewPage();
  }

  /**
   * Adds another offence from the review page and asserts the form is shown.
   */
  addAnotherOffenceFromReview(): void {
    log('flow', 'Adding another offence from review');
    this.offenceReview.clickAddAnotherOffence();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Navigates from the offence review page to amend a specific offence.
   * @param offenceCode - Offence code caption to amend.
   */
  amendOffenceFromReview(offenceCode: string): void {
    log('flow', 'Amending offence from review', { offenceCode });
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.clickChangeOffence(offenceCode);
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Opens Check account details from the task list and asserts the review page.
   * @param accountDetailsHeader - Optional Account details header to assert before navigating.
   */
  checkManualAccountDetails(accountDetailsHeader?: string): void {
    log('flow', 'Checking manual account details from task list', { accountDetailsHeader });
    this.accountDetails.assertOnAccountDetailsPage(accountDetailsHeader);
    this.reviewAccount.clickCheckAccount();
    this.reviewAccount.assertOnReviewPage();
  }

  /**
   * Opens the Individual minor creditor form (no BACS) and fills provided fields without saving.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (individual) without payment data.
   */
  maintainIndividualMinorCreditor(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Maintaining individual minor creditor details', { imposition, details });
    this.ensureOnMinorCreditorPage(index);
    this.offenceMinorCreditor.selectCreditorType('Individual');

    if (details.title) {
      this.offenceMinorCreditor.selectTitle(details.title);
    }
    if (details.firstNames) {
      this.offenceMinorCreditor.setField('firstNames', details.firstNames);
    }
    if (details.lastName) {
      this.offenceMinorCreditor.setField('lastName', details.lastName);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }
  }

  /**
   * Populates only BACS payment details on the minor creditor form (does not save).
   * @param imposition - 1-based imposition number (for logging).
   * @param details - BACS payment details.
   */
  maintainMinorCreditorBacsDetails(imposition: number, details: MinorCreditorWithBacs): void {
    log('flow', 'Maintaining minor creditor BACS details', { imposition, details });
    this.ensureOnMinorCreditorPage(imposition - 1);
    this.offenceMinorCreditor.togglePayByBacs(true);

    if (details.accountName) {
      this.offenceMinorCreditor.setField('accountName', details.accountName);
    }
    if (details.sortCode) {
      this.offenceMinorCreditor.setField('sortCode', details.sortCode);
    }
    if (details.accountNumber) {
      this.offenceMinorCreditor.setField('accountNumber', details.accountNumber);
    }
    if (details.paymentReference) {
      this.offenceMinorCreditor.setField('paymentReference', details.paymentReference);
    }
  }

  /**
   * Updates an Individual minor creditor (with optional BACS) via Change action and saves.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (individual) including optional BACS.
   */
  updateIndividualMinorCreditorWithBacs(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Updating individual minor creditor with BACS', { imposition, details });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.clickMinorCreditorAction(index, 'Change');
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Individual');

    if (details.title) {
      this.offenceMinorCreditor.selectTitle(details.title);
    }
    if (details.firstNames) {
      this.offenceMinorCreditor.setField('firstNames', details.firstNames);
    }
    if (details.lastName) {
      this.offenceMinorCreditor.setField('lastName', details.lastName);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }

    const hasBacsDetails = [
      details.accountName,
      details.sortCode,
      details.accountNumber,
      details.paymentReference,
    ].some(Boolean);
    if (hasBacsDetails) {
      this.offenceMinorCreditor.togglePayByBacs(true);
      if (details.accountName) {
        this.offenceMinorCreditor.setField('accountName', details.accountName);
      }
      if (details.sortCode) {
        this.offenceMinorCreditor.setField('sortCode', details.sortCode);
      }
      if (details.accountNumber) {
        this.offenceMinorCreditor.setField('accountNumber', details.accountNumber);
      }
      if (details.paymentReference) {
        this.offenceMinorCreditor.setField('paymentReference', details.paymentReference);
      }
    }

    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Opens the Company minor creditor form (no BACS) and fills provided fields without saving.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (company) without payment data.
   */
  maintainCompanyMinorCreditor(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Maintaining company minor creditor details', { imposition, details });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Company');

    if (details.company) {
      this.offenceMinorCreditor.setField('company', details.company);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }
  }

  /**
   * Completes an Individual minor creditor with BACS details and saves.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (individual) including optional BACS.
   */
  maintainIndividualMinorCreditorWithBacs(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Maintaining individual minor creditor with BACS', { imposition, details });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Individual');

    if (details.title) {
      this.offenceMinorCreditor.selectTitle(details.title);
    }
    if (details.firstNames) {
      this.offenceMinorCreditor.setField('firstNames', details.firstNames);
    }
    if (details.lastName) {
      this.offenceMinorCreditor.setField('lastName', details.lastName);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }

    const hasBacsDetails = [
      details.accountName,
      details.sortCode,
      details.accountNumber,
      details.paymentReference,
    ].some(Boolean);
    if (hasBacsDetails) {
      this.offenceMinorCreditor.togglePayByBacs(true);
      if (details.accountName) {
        this.offenceMinorCreditor.setField('accountName', details.accountName);
      }
      if (details.sortCode) {
        this.offenceMinorCreditor.setField('sortCode', details.sortCode);
      }
      if (details.accountNumber) {
        this.offenceMinorCreditor.setField('accountNumber', details.accountNumber);
      }
      if (details.paymentReference) {
        this.offenceMinorCreditor.setField('paymentReference', details.paymentReference);
      }
    }

    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Completes a Company minor creditor with BACS details and saves.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (company) including optional BACS.
   */
  maintainCompanyMinorCreditorWithBacs(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Maintaining company minor creditor with BACS', { imposition, details });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Company');

    if (details.company) {
      this.offenceMinorCreditor.setField('company', details.company);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }

    const hasBacsDetails = [
      details.accountName,
      details.sortCode,
      details.accountNumber,
      details.paymentReference,
    ].some(Boolean);
    if (hasBacsDetails) {
      this.offenceMinorCreditor.togglePayByBacs(true);
      if (details.accountName) {
        this.offenceMinorCreditor.setField('accountName', details.accountName);
      }
      if (details.sortCode) {
        this.offenceMinorCreditor.setField('sortCode', details.sortCode);
      }
      if (details.accountNumber) {
        this.offenceMinorCreditor.setField('accountNumber', details.accountNumber);
      }
      if (details.paymentReference) {
        this.offenceMinorCreditor.setField('paymentReference', details.paymentReference);
      }
    }

    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Seeds an offence with two minor creditor impositions (individual + company with BACS).
   * @param offenceCode - Offence code to seed.
   */
  seedOffenceWithTwoMinorCreditors(offenceCode: string): void {
    const date = calculateWeeksInPast(9);
    log('flow', 'Seeding offence with two minor creditors', { offenceCode, date });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.setOffenceField('Offence code', offenceCode);
    this.offenceDetails.setOffenceField('Date of sentence', date);

    // Imposition 1 – Individual minor creditor with BACS
    this.offenceDetails.setImpositionField(0, 'Result code', 'Compensation (FCOMP)');
    this.offenceDetails.setImpositionField(0, 'Amount imposed', '200');
    this.offenceDetails.setImpositionField(0, 'Amount paid', '100');
    this.offenceDetails.selectCreditorType(0, 'minor');
    this.offenceDetails.openMinorCreditorDetails(0);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Individual');
    this.offenceMinorCreditor.selectTitle('Mr');
    this.offenceMinorCreditor.setField('firstNames', 'FNAME');
    this.offenceMinorCreditor.setField('lastName', 'LNAME');
    this.offenceMinorCreditor.setField('address1', 'Addr1');
    this.offenceMinorCreditor.setField('address2', 'Addr2');
    this.offenceMinorCreditor.setField('address3', 'Addr3');
    this.offenceMinorCreditor.setField('postcode', 'TE12 3ST');
    this.offenceMinorCreditor.togglePayByBacs(true);
    this.offenceMinorCreditor.setField('accountName', 'F LNAME');
    this.offenceMinorCreditor.setField('sortCode', '123456');
    this.offenceMinorCreditor.setField('accountNumber', '12345678');
    this.offenceMinorCreditor.setField('paymentReference', 'REF');
    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();

    // Imposition 2 – Company minor creditor with BACS
    this.offenceDetails.clickAddAnotherImposition();
    this.offenceDetails.setImpositionField(1, 'Result code', 'Compensation (FCOMP)');
    this.offenceDetails.setImpositionField(1, 'Amount imposed', '200');
    this.offenceDetails.setImpositionField(1, 'Amount paid', '100');
    this.offenceDetails.selectCreditorType(1, 'minor');
    this.offenceDetails.openMinorCreditorDetails(1);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Company');
    this.offenceMinorCreditor.setField('company', 'CNAME');
    this.offenceMinorCreditor.setField('address1', 'Addr1');
    this.offenceMinorCreditor.setField('address2', 'Addr2');
    this.offenceMinorCreditor.setField('address3', 'Addr3');
    this.offenceMinorCreditor.setField('postcode', 'TE12 3ST');
    this.offenceMinorCreditor.togglePayByBacs(true);
    this.offenceMinorCreditor.setField('accountName', 'F LNAME');
    this.offenceMinorCreditor.setField('sortCode', '123456');
    this.offenceMinorCreditor.setField('accountNumber', '12345678');
    this.offenceMinorCreditor.setField('paymentReference', 'REF');
    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Selects creditor/minor creditor radio options based on label.
   * @param label - Label describing the radio to select.
   * @param impositionIndex - Zero-based imposition index for major/minor selection.
   */
  selectMinorCreditorRadioOption(label: string, impositionIndex: number): void {
    const normalized = label.toLowerCase();

    if (normalized.includes('minor creditor') || normalized.includes('major creditor')) {
      if (impositionIndex === undefined || impositionIndex < 0) {
        throw new Error('Imposition index is required when selecting major/minor creditor');
      }
      const type = normalized.includes('minor') ? 'minor' : 'major';
      this.offenceDetails.selectCreditorType(impositionIndex, type as 'major' | 'minor');
      return;
    }

    if (normalized.includes('individual') || normalized.includes('company')) {
      const type = normalized.includes('individual') ? 'Individual' : 'Company';
      this.offenceMinorCreditor.selectCreditorType(type as 'Individual' | 'Company');
      return;
    }

    throw new Error(`Unknown radio button label: ${label}`);
  }

  /**
   * Opens company minor creditor form, populates company, cancels, and asserts values persist.
   * @param imposition - 1-based imposition number.
   * @param company - Company name to populate.
   */
  openAndCancelCompanyMinorCreditor(imposition: number, company: string): void {
    const index = imposition - 1;
    log('flow', 'Opening company minor creditor and cancelling with data preserved', { imposition, company });
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Company');
    this.offenceMinorCreditor.setField('company', company);
    this.offenceMinorCreditor.cancelAndChoose('Cancel');
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.assertCreditorTypeSelected('Company');
    this.offenceMinorCreditor.assertFieldValue('company', company);
  }

  /**
   * Asserts field values on the minor creditor form (including payment method toggle).
   * @param expectations - Label/value pairs to assert.
   */
  assertMinorCreditorFormValues(expectations: Record<string, string>): void {
    const entries = Object.entries(expectations);
    if (!entries.length) {
      throw new Error('No minor creditor fields provided for assertion');
    }

    log('assert', 'Asserting minor creditor field values', { expectations });

    entries.forEach(([label, value]) => {
      if (/payment method/i.test(label)) {
        const shouldBeBacs = /bacs/i.test(value);
        this.offenceMinorCreditor.assertPayByBacsState(shouldBeBacs);
        return;
      }

      const key = resolveMinorCreditorFieldKey(label);
      this.offenceMinorCreditor.assertFieldValue(key, value);
    });
  }

  /**
   * Asserts payment detail values on the minor creditor form.
   * @param expectations - Label/value pairs to assert.
   */
  assertMinorCreditorPaymentValues(expectations: Record<string, string>): void {
    const entries = Object.entries(expectations);
    if (!entries.length) {
      throw new Error('No payment detail fields provided for assertion');
    }

    log('assert', 'Asserting minor creditor payment detail values', { expectations });

    entries.forEach(([label, value]) => {
      if (/payment method/i.test(label)) {
        const shouldBeBacs = /bacs/i.test(value);
        this.offenceMinorCreditor.assertPayByBacsState(shouldBeBacs);
        return;
      }

      const key = resolveMinorCreditorFieldKey(label);
      this.offenceMinorCreditor.assertFieldValue(key, value);
    });
  }

  /**
   * Cancels the minor creditor form with a chosen dialog response.
   * @param choice - Confirmation choice.
   */
  cancelMinorCreditorDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('cancel', 'Cancelling minor creditor details', { choice });
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.cancelAndChoose(choice);
  }

  /**
   * Cancels the minor creditor removal flow for an imposition.
   * @param imposition - 1-based imposition number.
   */
  cancelRemoveMinorCreditor(imposition: number): void {
    const index = imposition - 1;
    log('flow', 'Cancelling remove minor creditor', { imposition });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.clickMinorCreditorAction(index, 'Remove');
    this.common.assertHeaderContains('Are you sure you want to remove this minor creditor?');
    this.offenceDetails.cancelRemoveMinorCreditor();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Confirms the minor creditor removal flow for an imposition.
   * @param imposition - 1-based imposition number.
   */
  confirmRemoveMinorCreditor(imposition: number): void {
    const index = imposition - 1;
    log('flow', 'Confirming remove minor creditor', { imposition });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.clickMinorCreditorAction(index, 'Remove');
    this.common.assertHeaderContains('Are you sure you want to remove this minor creditor?');
    this.offenceDetails.confirmRemoveMinorCreditor();
    this.offenceDetails.assertMinorCreditorAbsent(index);
  }

  /**
   * Cancels the remove minor creditor confirmation page.
   */
  cancelRemoveMinorCreditorConfirmation(): void {
    log('navigate', 'Cancelling minor creditor removal confirmation');
    this.offenceDetails.cancelRemoveMinorCreditor();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Asserts a minor creditor summary for an imposition (expands the details).
   * @param imposition - 1-based imposition number.
   * @param expectations - Expected summary values.
   */
  assertMinorCreditorSummary(imposition: number, expectations: MinorCreditorSummary): void {
    const index = imposition - 1;
    log('assert', 'Asserting minor creditor summary', { imposition, expectations });
    this.offenceDetails.toggleMinorCreditorDetails(index, 'Show details');
    this.offenceDetails.assertMinorCreditorDetails(index, expectations);
  }

  /**
   * Asserts remove imposition links visibility for a set of impositions.
   * @param impositions - Array of 1-based imposition numbers.
   * @param expectedVisible - Whether links should be visible.
   */
  assertRemoveImpositionLinks(impositions: number[], expectedVisible: boolean = true): void {
    log('assert', 'Asserting remove imposition links', { impositions, expectedVisible });
    impositions.forEach((imposition) => {
      const index = imposition - 1;
      this.offenceDetails.assertRemoveImpositionLink(index, expectedVisible);
    });
  }

  /**
   * Provides payment terms from the Account details task list.
   * @param payload - Payment terms payload including collection order and dates.
   */
  providePaymentTermsFromAccountDetails(payload: ManualPaymentTermsInput, accountDetailsHeader?: string): void {
    log('flow', 'Provide payment terms from Account details', { payload, accountDetailsHeader });
    cy.location('pathname', { timeout: this.pathTimeout }).then((pathname) => {
      if (!pathname.includes('/account-details')) {
        this.taskNavigation.navigateToAccountDetails();
      } else {
        this.accountDetails.assertOnAccountDetailsPage(accountDetailsHeader);
      }
      this.openTaskFromAccountDetails('Payment terms', accountDetailsHeader);
      this.paymentTerms.fillPaymentTerms(payload);
    });
  }

  /**
   * Completes payment terms assuming navigation is handled by the caller.
   * @param payload - Payment terms payload to populate.
   */
  completePaymentTerms(payload: ManualPaymentTermsInput): void {
    log('flow', 'Complete payment terms (navigation handled by caller)', { payload });
    this.paymentTerms.fillPaymentTerms(payload);
  }

  /**
   * Asserts payment terms values on the task.
   * @param expected - Expected payment terms values.
   */
  assertPaymentTermsFields(expected: ManualPaymentTermsExpectations): void {
    log('flow', 'Asserting payment terms fields', { expected });
    this.paymentTerms.assertPaymentTermsValues(expected);
  }

  /**
   * Cancels Payment terms with a specific choice.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelPaymentTerms(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Payment terms', { choice });
    this.paymentTerms.cancelAndChoose(choice);
  }

  /**
   * Cancels Payment terms and confirms return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelPaymentTermsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Payment terms and return to Account details', { choice });
    this.paymentTerms.cancelAndChoose(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates from Payment terms to Account comments and notes.
   */
  proceedToAccountCommentsFromPaymentTerms(): void {
    log('flow', 'Proceeding to Account comments and notes from Payment terms');
    this.paymentTerms.assertOnPaymentTermsPage();
    this.paymentTerms.clickAddAccountCommentsAndNotes();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', 'account-comments');
    this.commentsAndNotes.assertHeader();
  }

  /**
   * Asserts multiple task statuses after returning to Account details.
   * @param statuses - List of task/status pairs to assert.
   */
  assertTaskStatuses(
    statuses: Array<{ task: ManualAccountTaskName; status: string }>,
    accountDetailsHeader?: string,
  ): void {
    log('flow', 'Asserting multiple task statuses', { statuses, accountDetailsHeader });
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage(accountDetailsHeader);
    statuses.forEach(({ task, status }) => this.accountDetails.assertTaskStatus(task, status, accountDetailsHeader));
  }

  /**
   * Opens Account comments and notes and asserts the header.
   */
  openAccountCommentsAndNotesTask(): void {
    log('flow', 'Open Account comments and notes task');
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.assertHeader();
  }

  /**
   * Navigates from Company details to Contact details.
   */
  continueToContactDetailsFromCompany(): void {
    log('flow', 'Continue to contact details from Company details');
    this.companyDetails.clickAddContactDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
    this.contactDetails.assertOnContactDetailsPage();
  }

  /**
   * Cancels Company details and returns to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelCompanyDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Company details and return to Account details', { choice });
    this.common.cancelEditing(true);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Continues from Contact details to Employer details.
   */
  continueToEmployerDetailsFromContact(): void {
    log('flow', 'Continue to Employer details from Contact details');
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.clickAddEmployerDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/employer-details');
    this.common.assertHeaderContains('Employer details', this.pathTimeout);
  }

  /**
   * Continues from Contact details to Offence details.
   */
  continueToOffenceDetailsFromContact(): void {
    log('flow', 'Continue to Offence details from Contact details');
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.clickAddOffenceDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/offence-details');
    this.common.assertHeaderContains('offence', this.pathTimeout);
  }

  /**
   * Cancels Contact details without navigation expectations.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelContactDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Contact details', { choice });
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.cancelAndChoose(choice);
  }

  /**
   * Confirms cancellation on Contact details and asserts return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  confirmContactDetailsCancellation(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Confirm Contact details cancellation and return', { choice });
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.cancelAndChoose(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Populates Company details using a data table object.
   * @param data - Field/value pairs for company details.
   */
  fillCompanyDetailsFromTable(data: Record<string, string>): void {
    log('flow', 'Filling Company details from table data', data);
    if (data['company name'] !== undefined) {
      this.companyDetails.setCompanyName(data['company name']);
    }
    if (data['address line 1'] !== undefined) {
      this.companyDetails.setAddressLine1(data['address line 1']);
    }
    if (data['address line 2'] !== undefined) {
      this.companyDetails.setAddressLine2(data['address line 2']);
    }
    if (data['address line 3'] !== undefined) {
      this.companyDetails.setAddressLine3(data['address line 3']);
    }
    if (data['postcode'] !== undefined) {
      this.companyDetails.setPostcode(data['postcode']);
    }
  }

  /**
   * Adds company aliases and toggles the checkbox on.
   * @param aliases - Alias rows containing alias number and name.
   */
  addCompanyAliases(aliases: CompanyAliasRow[]): void {
    log('flow', 'Adding company aliases', { aliases });
    this.companyDetails.toggleAddAliases(true);
    aliases.forEach((row, index) => {
      const aliasNumber = Number(row.alias);
      const aliasName = row.name;
      if (!Number.isFinite(aliasNumber)) {
        throw new Error(`Alias index must be numeric. Received: ${row.alias}`);
      }
      if (index > 0) {
        this.companyDetails.addAnotherAlias();
      }
      this.companyDetails.setAliasCompanyName(aliasNumber, aliasName);
    });
  }

  /**
   * Asserts company aliases and checkbox state.
   * @param aliases - Alias rows to validate.
   * @param expectedChecked - Whether the add-aliases checkbox should be checked.
   */
  assertCompanyAliases(aliases: CompanyAliasRow[], expectedChecked: boolean = true): void {
    log('flow', 'Asserting company aliases', { aliases, expectedChecked });
    this.companyDetails.assertAddAliasesChecked(expectedChecked);
    aliases.forEach((row) => {
      const aliasNumber = Number(row.alias);
      const aliasName = row.name;
      if (!Number.isFinite(aliasNumber)) {
        throw new Error(`Alias index must be numeric. Received: ${row.alias}`);
      }
      this.companyDetails.assertAliasCompanyName(aliasNumber, aliasName);
    });
  }

  /**
   * Asserts Company detail field values using table data.
   * @param data - Field/value pairs for company details.
   */
  assertCompanyDetailsFields(data: Record<string, string>): void {
    log('flow', 'Asserting Company details fields', data);
    if (data['company name'] !== undefined) {
      this.companyDetails.assertFieldValue('company', data['company name']);
    }
    if (data['address line 1'] !== undefined) {
      this.companyDetails.assertFieldValue('address1', data['address line 1']);
    }
    if (data['address line 2'] !== undefined) {
      this.companyDetails.assertFieldValue('address2', data['address line 2']);
    }
    if (data['address line 3'] !== undefined) {
      this.companyDetails.assertFieldValue('address3', data['address line 3']);
    }
    if (data['postcode'] !== undefined) {
      this.companyDetails.assertFieldValue('postcode', data['postcode']);
    }
  }

  /**
   * Moves from the offence review page to Payment terms via CTA.
   */
  continueToPaymentTermsFromReview(): void {
    log('flow', 'Continue to payment terms from offence review');
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.clickAddPaymentTerms();
  }

  /**
   * Submits the offence search form, guarding the search page.
   */
  submitOffenceSearch(): void {
    log('flow', 'Submit offence search');
    this.offenceSearch.assertOnSearchPage();
    this.offenceSearch.submitSearch();
  }

  /**
   * Returns from the offence search results to the search form.
   */
  returnToOffenceSearchForm(): void {
    log('flow', 'Return to offence search form');
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.clickBackLink();
    this.offenceSearch.assertOnSearchPage();
  }

  /**
   * Populates offence search criteria and submits the form.
   * @param criteria - Field/value pairs keyed by field label.
   */
  searchOffences(criteria: Record<string, string>): void {
    this.offenceSearch.assertOnSearchPage();
    Object.entries(criteria).forEach(([label, value]) => {
      if (value === undefined || value === null) return;
      const trimmed = value.toString().trim();
      const field = resolveSearchFieldKey(label);
      if (trimmed === '') {
        this.offenceSearch.clearSearchField(field);
      } else {
        this.offenceSearch.setSearchField(field, trimmed);
      }
    });
    this.offenceSearch.submitSearch();
  }

  /**
   * Asserts every offence search result row contains the given values.
   * @param rows - Array of { Column, Value } expectations.
   */
  assertAllOffenceResults(rows: Array<{ Column: string; Value: string }>): void {
    this.offenceSearch.assertOnResultsPage();
    rows.forEach(({ Column, Value }) => {
      this.offenceSearch.assertAllResultsContain(resolveSearchResultColumn(Column), Value);
    });
  }

  /**
   * Asserts offence search results include rows with provided values.
   * @param rows - Array of { Column, Values[] } expectations.
   */
  assertOffenceResultsContain(rows: Array<{ Column: string; Values: string[] }>): void {
    this.offenceSearch.assertOnResultsPage();
    rows.forEach(({ Column, Values }) => {
      this.offenceSearch.assertResultsIncludeValues(resolveSearchResultColumn(Column), Values);
    });
  }

  /**
   * Enables inactive offences checkbox and runs the search (guards state).
   */
  enableInactiveOffencesAndSearch(): void {
    cy.get('body').then(($body) => {
      const onResultsPage = $body.find(L.search.resultsTable).length > 0;
      if (onResultsPage) {
        this.offenceSearch.clickBackLink();
      }
    });
    this.offenceSearch.assertOnSearchPage();
    this.offenceSearch.toggleIncludeInactive(true);
    this.offenceSearch.submitSearch();
    this.offenceSearch.assertOnResultsPage();
  }

  /**
   * Disables inactive offences and reruns the search.
   */
  resetInactiveOffencesAndSearch(): void {
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.clickBackLink();
    this.offenceSearch.assertOnSearchPage();
    this.offenceSearch.toggleIncludeInactive(false);
    this.offenceSearch.submitSearch();
    this.offenceSearch.assertOnResultsPage();
  }

  /**
   * Asserts results contain both active and inactive offences.
   */
  assertActiveAndInactiveResults(): void {
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.getResultColumnValues('Used to').then((values) => {
      expect(values.some((v) => v.includes('Present'))).to.be.true;
      expect(values.some((v) => v && !v.includes('Present'))).to.be.true;
    });
  }

  /**
   * Asserts results contain only active offences.
   */
  assertActiveOnlyResults(): void {
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.getResultColumnValues('Used to').then((values) => {
      expect(values.length).to.be.greaterThan(0);
      expect(values.every((v) => v.includes('Present'))).to.be.true;
    });
  }

  /**
   * Runs accessibility checks on the minor creditor form for an imposition.
   * @param imposition - 1-based imposition number.
   * @param company - Company name to populate in company mode.
   */
  runMinorCreditorAccessibility(imposition: number, company: string): void {
    const index = imposition - 1;
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Individual');
    accessibilityActions().checkAccessibilityOnly();

    this.offenceMinorCreditor.selectCreditorType('Company');
    this.offenceMinorCreditor.setField('company', company);
    this.offenceMinorCreditor.togglePayByBacs(true);
    accessibilityActions().checkAccessibilityOnly();
    this.offenceMinorCreditor.togglePayByBacs(false);
    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Runs accessibility checks on remove minor creditor confirmation.
   * @param imposition - 1-based imposition number.
   */
  runRemoveMinorCreditorAccessibility(imposition: number): void {
    const index = imposition - 1;
    this.offenceDetails.clickMinorCreditorAction(index, 'Remove');
    this.common.assertHeaderContains('Are you sure you want to remove this minor creditor?');
    accessibilityActions().checkAccessibilityOnly();
    this.offenceDetails.cancelRemoveMinorCreditor();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Runs accessibility checks on remove imposition confirmation.
   * @param imposition - 1-based imposition number.
   */
  runRemoveImpositionAccessibility(imposition: number): void {
    const index = imposition - 1;
    this.offenceDetails.clickRemoveImposition(index);
    this.common.assertHeaderContains('Are you sure you want to remove this imposition?');
    accessibilityActions().checkAccessibilityOnly();
    this.offenceDetails.cancelRemoveImposition();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Runs accessibility checks across the offence removal flow.
   * @param offenceCode - Offence code to remove.
   */
  runOffenceRemovalAccessibility(offenceCode: string): void {
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.clickRemoveOffence(offenceCode);
    this.offenceReview.assertOnRemoveOffencePage(offenceCode);
    accessibilityActions().checkAccessibilityOnly();
    this.offenceReview.confirmRemoveOffence();
    this.offenceReview.assertOnReviewPage();
    this.common.assertHeaderContains('Offences and impositions');
    accessibilityActions().checkAccessibilityOnly();
  }

  /**
   * Ensures the minor creditor form is open for a given imposition.
   * @param index - Zero-based imposition index.
   */
  private ensureOnMinorCreditorPage(index: number): void {
    cy.get('body').then(($body) => {
      const onMinorCreditor = $body.find(L.minorCreditorForm.saveButton).length > 0;
      if (onMinorCreditor) {
        this.offenceMinorCreditor.assertOnMinorCreditorPage();
        return;
      }

      this.offenceDetails.assertOnAddOffencePage();
      this.offenceDetails.openMinorCreditorDetails(index);
      this.offenceMinorCreditor.assertOnMinorCreditorPage();
    });
  }

  /**
   * Ensures the Manual Account Creation start page is loaded from the dashboard.
   *
   * @remarks
   * - Clicks the dashboard link to Manual Account Creation.
   * - Asserts the create account header is visible.
   * - Use before selecting business unit/account/defendant type.
   */
  private ensureOnCreateAccountPage(): void {
    this.dashboard.goToManualAccountCreation();
    this.createAccount.assertOnCreateAccountPage();
  }

  /**
   * Ensures the requested imposition index exists by adding rows as needed.
   * @param index - Zero-based imposition index to guarantee.
   */
  private ensureImpositionIndex(index: number): Cypress.Chainable<number> {
    return this.offenceDetails.getImpositionCount().then((count) => {
      const needed = index - count + 1;
      if (needed > 0) {
        return cy
          .wrap(Array.from({ length: needed }))
          .each(() => this.offenceDetails.clickAddAnotherImposition())
          .then(() => this.offenceDetails.getImpositionCount());
      }
      return cy.wrap(count);
    });
  }
}
