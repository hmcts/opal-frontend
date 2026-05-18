/**
 * @file draftAccount.steps.ts
 * @description
 * Step definitions for creating draft accounts, setting their status, and interacting with draft listings
 * (Create & Manage + Check & Validate).
 * Supports multiple Gherkin aliases that map to one underlying implementation,
 * keeping features readable while avoiding duplicate logic.
 *
 * @remarks
 * - These steps operate at the API level via Cypress tasks — no UI overhead.
 * - Listing steps drive the Create and Manage Draft Accounts UI.
 * - Use them in Background or setup stages to prepare predictable data states.
 * - Aliases allow both the explicit and implicit “Publishing Pending” forms.
 *
 * @example
 *   Given I create a "company" draft account with the following details and set status "Submitted":
 *     | account.defendant.company_name | Example Co Ltd |
 *     | account.account_type           | Fine           |
 *
 * @example
 *   And I create and publish an "adultOrYouthOnly" draft account with the following details:
 *     | account.defendant.forenames | John |
 *     | account.defendant.surname   | Smith |
 */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import {
  assertLatestDraftUpdateHasStrongEtag,
  assertStaleIfMatchConflict,
  createDraftAndSetStatus,
  simulateStaleIfMatchConflict,
  updateLastCreatedDraftAccountStatus,
} from '../../../e2e/functional/opal/actions/draft-account/draft-account.api';
import {
  CreateManageDraftsActions,
  CreateManageTab,
} from '../../../e2e/functional/opal/actions/draft-account/create-manage-drafts.actions';
import { DraftTabsActions, InputterTab, CheckerTab } from '../../../e2e/functional/opal/actions/draft-tabs.actions';
import {
  CheckAndValidateDraftsActions,
  CheckAndValidateTab,
} from '../../../e2e/functional/opal/actions/draft-account/check-and-validate-drafts.actions';
import { CheckAndValidateReviewActions } from '../../../e2e/functional/opal/actions/draft-account/check-and-validate-review.actions';
import { DraftAccountsInterceptActions } from '../../../e2e/functional/opal/actions/draft-account/draft-accounts.intercepts';
import { DraftAccountsTableColumn } from '../../../e2e/functional/opal/actions/draft-account/draft-accounts-common.actions';
import { DraftPayloadType } from '../../../support/utils/payloads';
import { log } from '../../utils/log.helper';
import { DraftAccountsFlow } from '../../../e2e/functional/opal/flows/draft-accounts.flow';
import { parseToIsoDate } from '../../utils/dateUtils';
import { applyUniqPlaceholder } from '../../utils/stringUtils';
import { convertDataTableToNestedObject } from '../../utils/table';
import { captureSignedInUserEmail } from 'cypress/e2e/functional/opal/actions/login.actions';
import { AccountSearchIndividualsActions } from '../../../e2e/functional/opal/actions/search/search.individuals.actions';
import { PrimaryNavigationActions } from '../../../e2e/functional/opal/actions/primary-navigation.actions';
import {
  buildPublishedNonVehicleFixedPenaltyOverrides,
  buildPublishedVehicleFixedPenaltyCompanyOverrides,
} from './draft-account.seed-builders';

type AccountType = DraftPayloadType;
type DraftOverrideValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | DraftOverrideValue[]
  | { [key: string]: DraftOverrideValue };
type DraftOverrides = Record<string, DraftOverrideValue>;
type DraftAccountEntryPoint = 'Create and Manage Draft Accounts' | 'Check and Validate Draft Accounts';
const DEFAULT_DRAFT_STATUS = 'Publishing Pending';
const DEFAULT_PUBLISHING_USER = 'opal-test-10@dev.platform.hmcts.net';
const inputter = () => new CreateManageDraftsActions();
const checker = () => new CheckAndValidateDraftsActions();
const checkerReview = () => new CheckAndValidateReviewActions();
const intercepts = () => new DraftAccountsInterceptActions();
const draftsFlow = () => new DraftAccountsFlow();
const tabs = () => new DraftTabsActions();
const searchIndividuals = () => new AccountSearchIndividualsActions();
const primaryNavigation = () => new PrimaryNavigationActions();
const withUniq = (value: string) => applyUniqPlaceholder(value ?? '');

/**
 * Normalizes a two-column setup table into a case-insensitive key/value map.
 * @param table - Source setup table from the feature file.
 * @returns A plain object keyed by normalized table labels.
 */
function parseSeedValues(table: DataTable): Record<string, string> {
  return Object.fromEntries(
    table.raw().map(([key, value]) => [
      String(key ?? '')
        .trim()
        .toLowerCase(),
      withUniq(String(value ?? '').trim()),
    ]),
  );
}

/**
 * Resolves feature-file language values into the API language codes used by debtor detail.
 * @param value - Raw language value supplied by the scenario table.
 * @param fallback - Default language code when no value is supplied.
 * @returns The normalized two-letter language code.
 */
function resolveLanguageCode(value: string | undefined, fallback: 'CY' | 'EN' = 'CY'): string {
  if (!value) return fallback;

  const normalized = value.trim().toUpperCase();
  if (normalized === 'WELSH AND ENGLISH') return 'CY';
  if (normalized === 'ENGLISH ONLY') return 'EN';

  return normalized;
}

/**
 * Parses the business unit id from setup-table input.
 * @param value - Raw business unit id from the feature file.
 * @param fallback - Default business unit id when no value is supplied.
 * @returns The numeric business unit id to send to the draft API.
 */
function resolveBusinessUnitId(value: string | undefined, fallback: number = 77): number {
  if (!value) return fallback;

  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected business unit id to be numeric, received "${value}".`);
  }

  return parsed;
}

/**
 * Resolves the user who should perform the publishing/approval action for a seeded account.
 * @param values - Normalized seed table values.
 * @returns Email/username to use when moving the draft into the published state.
 */
function resolvePublishingUser(values: Record<string, string>): string {
  return (
    values['publishing user'] ??
    values['approving user'] ??
    values['approval user'] ??
    values['published by user'] ??
    DEFAULT_PUBLISHING_USER
  );
}

/**
 * Recursively expands `{uniq}` tokens within nested draft override objects.
 * @param input - Override value or object graph to normalize.
 * @returns A clone-safe value with placeholder tokens expanded.
 */
function applyUniqToOverrides(input: DraftOverrideValue): DraftOverrideValue {
  if (typeof input === 'string') {
    return applyUniqPlaceholder(input);
  }

  if (Array.isArray(input)) {
    return input.map((item) => applyUniqToOverrides(item));
  }

  if (input && typeof input === 'object') {
    const overrides = input as DraftOverrides;
    return Object.fromEntries(
      Object.entries(overrides).map(([key, value]) => [key, applyUniqToOverrides(value)]),
    ) as DraftOverrides;
  }

  return input;
}

/**
 * Converts a Gherkin DataTable into nested draft overrides and expands any `{uniq}` tokens.
 * @param table - Source table containing draft override paths and values.
 * @returns A nested override object ready to merge into the fixture payload.
 */
function convertTableToDraftOverrides(table: DataTable): Record<string, unknown> {
  return applyUniqToOverrides(convertDataTableToNestedObject(table) as DraftOverrides) as DraftOverrides;
}

/**
 * Resolves the currently signed-in user so draft setup can restore that identity afterwards.
 * @param action - Callback that performs the next Cypress action with the current user email.
 * @returns The callback result wrapped in the Cypress command chain.
 */
function withSignedInUser<T>(action: (existingUser: string) => Cypress.Chainable<T>): Cypress.Chainable<T> {
  return captureSignedInUserEmail().then((existingUser: string) => action(existingUser));
}

/**
 * Unified implementation used by all step aliases.
 *
 * @param accountType - Draft payload type (e.g., company, pgToPay).
 * @param overrides - Nested override object defining the account fields and values.
 * @param status - The target status after creation (defaults to the publishing-pending status).
 * @param switchToUser - User to perform the status update (for logging/evidence).
 * @param returnToUser - User to return to after status update (for logging/evidence).
 * @returns Cypress.Chainable
 *
 * @remarks
 * - Writes Cypress logs for clear traceability in the test runner.
 * - Default behaviour simulates the “create and publish pending” lifecycle.
 */
function createDraftAndPrepareForPublishing(
  accountType: AccountType,
  overrides: Record<string, unknown>,
  status: string = DEFAULT_DRAFT_STATUS,
  switchToUser: string = DEFAULT_PUBLISHING_USER,
  returnToUser: string = '',
) {
  log(
    'step',
    `Creating ${accountType} draft → ${status} using user ${switchToUser}, returning to user ${returnToUser}`,
    {
      accountType,
      status,
      user: switchToUser,
      returnToUser,
      fields: overrides,
    },
  );

  return createDraftAndSetStatus(accountType, status, overrides, switchToUser, returnToUser);
}

/**
 * Creates a published draft account while preserving the currently signed-in user for the remainder of the scenario.
 * @param accountType - Draft payload type to create.
 * @param overrides - Nested override object merged into the draft fixture.
 * @param publishingUser - User who should approve/publish the seeded account.
 * @returns Cypress.Chainable
 */
function createPublishedDraftAccount(
  accountType: AccountType,
  overrides: Record<string, unknown>,
  publishingUser: string = DEFAULT_PUBLISHING_USER,
): Cypress.Chainable<void> {
  return withSignedInUser((existingUser: string) =>
    createDraftAndPrepareForPublishing(accountType, overrides, DEFAULT_DRAFT_STATUS, publishingUser, existingUser),
  );
}

/**
 * Extracts an `account_status` override and converts the remaining rows into nested overrides.
 * @param table Source DataTable that may include an Account_status row.
 * @returns The parsed status and nested override object.
 */
function extractStatusAndOverrides(table: DataTable): { status: string; overrides: Record<string, unknown> } {
  const values = parseSeedValues(table);
  const status = values['account_status'] ?? DEFAULT_DRAFT_STATUS;
  const overrides = convertTableToDraftOverrides(table);

  return { status: status || DEFAULT_DRAFT_STATUS, overrides };
}

/**
 * @step Create a draft account, set explicit status, and persist.
 * @description
 *  Creates a draft account of the specified type, populates it with data from the
 *  provided Cucumber DataTable, and sets the draft's status before saving.
 *
 * @param accountType - The account type (e.g., "company" or "individual").
 * @param status - The target draft status to assign.
 * @param table - Cucumber DataTable containing field/value pairs for the draft account.
 *
 * @remarks
 *  - Uses the flow `createDraftAndPrepareForPublishing()` to perform all actions.
 *  - Utilizes `table.rows()` to safely extract the table data for logging.
 *
 * @example
 *  Given I create a "company" draft account with the following details and set status "Submitted":
 *    | account.defendant.company_name | Example Co |
 */
Given(
  'I create a {string} draft account with the following details and set status {string}:',
  (accountType: AccountType, status: string, table: DataTable) => {
    const data = table.rows();
    log('step', `Create ${accountType} draft, status ${status}`, { accountType, status, data });
    return withSignedInUser((existingUser: string) =>
      createDraftAndPrepareForPublishing(
        accountType,
        convertTableToDraftOverrides(table),
        status,
        existingUser,
        existingUser,
      ),
    );
  },
);

Given(
  'I create a {string} draft account with the following details and set status {string} using user {string}:',
  (accountType: AccountType, status: string, user: string, table: DataTable) => {
    const data = table.rows();
    log('step', `Create ${accountType} draft, status ${status}, submitting user ${user}`, {
      accountType,
      status,
      user,
      data,
    });
    return withSignedInUser((existingUser: string) =>
      createDraftAndPrepareForPublishing(accountType, convertTableToDraftOverrides(table), status, user, existingUser),
    );
  },
);

/**
 * @step Create a draft account from a table that includes Account_status.
 * @description Extracts Account_status for the status update and applies the remaining rows as payload overrides.
 *
 * @example
 *   Given a "adultOrYouthOnly" draft account exists with:
 *     | Account_status              | Submitted |
 *     | account.defendant.forenames | John      |
 *     | account.defendant.surname   | Smith     |
 */
Given('a {string} draft account exists with:', (accountType: AccountType, table: DataTable) => {
  const { status, overrides } = extractStatusAndOverrides(table);
  log('step', 'Create draft with table-provided status', { accountType, status });
  return withSignedInUser((existingUser: string) =>
    createDraftAndPrepareForPublishing(accountType, overrides, status, existingUser, existingUser),
  );
});

/**
 * @step Creates a published adult or youth defendant account.
 * @description
 * Seeds an `adultOrYouthOnly` account at API level and sets it to `Publishing Pending`.
 * This is intended as a reusable published-account setup step for journeys that need a
 * defendant account without coupling the seed to a specific epic or screen.
 *
 * Supported table keys:
 * - prosecutor case reference / pcr
 * - title
 * - first name / first names
 * - last name
 * - date of birth / dob
 * - business unit id
 * - publishing user / approving user / approval user
 *
 * @example
 *   Given a published adult or youth defendant account exists:
 *     | first name                | Jordan               |
 *     | last name                 | SummaryAdult{uniq}   |
 *     | prosecutor case reference | PCRR1BSUM{uniqUpper} |
 *     | date of birth             | 2001-05-15           |
 */
Given('a published adult or youth defendant account exists:', (table: DataTable) => {
  const values = parseSeedValues(table);

  const prosecutorCaseReference = values['prosecutor case reference'] ?? values['pcr'];
  const firstNames = values['first name'] ?? values['first names'];
  const lastName = values['last name'];
  const dateOfBirth = values['date of birth'] ?? values['dob'] ?? '2001-05-15';
  const title = values['title'] ?? 'Mr';
  const businessUnitId = resolveBusinessUnitId(values['business unit id']);
  const publishingUser = resolvePublishingUser(values);

  if (!prosecutorCaseReference || !firstNames || !lastName) {
    throw new Error('Expected prosecutor case reference, first name and last name for adult or youth defendant seed.');
  }

  const overrides = {
    business_unit_id: businessUnitId,
    account: {
      prosecutor_case_reference: prosecutorCaseReference,
      collection_order_made: false,
      collection_order_made_today: false,
      payment_card_request: false,
      defendant: {
        title,
        forenames: firstNames,
        surname: lastName,
        dob: dateOfBirth,
      },
    },
  };

  log('step', 'Creating published adult or youth defendant account', {
    prosecutorCaseReference,
    firstNames,
    lastName,
    dateOfBirth,
    businessUnitId,
    publishingUser,
  });

  return createPublishedDraftAccount('adultOrYouthOnly', overrides, publishingUser);
});

/**
 * @step Creates a published non-vehicle fixed penalty account.
 * @description
 * Seeds a `fixedPenalty` account at API level and sets it to `Publishing Pending`, overriding the
 * fixed-penalty ticket details so account-enquiry journeys can assert the non-vehicle tab layout.
 *
 * Supported table keys:
 * - title
 * - first name / first names
 * - last name
 * - ticket number
 * - issuing authority
 * - time of offence
 * - place of offence
 * - business unit id
 * - publishing user / approving user / approval user
 *
 * @example
 *   Given a published non-vehicle fixed penalty account exists:
 *     | first name        | Robert                  |
 *     | last name         | FixedPenaltyNV{uniq}    |
 *     | ticket number     | FPR1BNV{uniqUpper}      |
 *     | issuing authority | City of Metropolis      |
 *     | time of offence   | 14:30                   |
 *     | place of offence  | Main Street, Metropolis |
 */
Given('a published non-vehicle fixed penalty account exists:', (table: DataTable) => {
  const values = parseSeedValues(table);

  const firstNames = values['first name'] ?? values['first names'];
  const lastName = values['last name'];
  const ticketNumber = values['ticket number'];
  const issuingAuthority = values['issuing authority'] ?? 'Fixed Penalty Office';
  const timeOfOffence = values['time of offence'] ?? '14:30';
  const placeOfOffence = values['place of offence'];
  const businessUnitId = resolveBusinessUnitId(values['business unit id']);
  const publishingUser = resolvePublishingUser(values);
  const title = values['title'] ?? 'Mr';

  if (!firstNames || !lastName || !ticketNumber || !placeOfOffence) {
    throw new Error(
      'Expected first name, last name, ticket number and place of offence for non-vehicle fixed penalty seed.',
    );
  }

  const overrides = buildPublishedNonVehicleFixedPenaltyOverrides({
    businessUnitId,
    issuingAuthority,
    ticketNumber,
    title,
    firstNames,
    lastName,
    timeOfOffence,
    placeOfOffence,
  });

  log('step', 'Creating published non-vehicle fixed penalty account', {
    firstNames,
    lastName,
    ticketNumber,
    issuingAuthority,
    timeOfOffence,
    placeOfOffence,
    businessUnitId,
    publishingUser,
  });

  return createPublishedDraftAccount('opalE2EFixedPenaltyAdult', overrides, publishingUser);
});

/**
 * @step Creates a published vehicle fixed penalty company account.
 * @description
 * Seeds a `fixedPenaltyCompany` account at API level and sets it to `Publishing Pending`, applying
 * vehicle-specific fixed-penalty details so account-enquiry journeys can assert the vehicle fields.
 *
 * Supported table keys:
 * - company name
 * - ticket number
 * - issuing authority
 * - registration number
 * - driving licence
 * - notice to owner or hirer number (NTO/NTH)
 * - date notice to owner was issued
 * - time of offence
 * - place of offence
 * - business unit id
 * - publishing user / approving user / approval user
 *
 * @example
 *   Given a published vehicle fixed penalty company account exists:
 *     | company name                    | Fixed Penalty Co {uniq} |
 *     | ticket number                   | FPR1BVEH{uniqUpper}     |
 *     | registration number             | XY21 ABC                |
 *     | date notice to owner was issued | 01 May 2023             |
 */
Given('a published vehicle fixed penalty company account exists:', (table: DataTable) => {
  const values = parseSeedValues(table);

  const companyName = values['company name'];
  const ticketNumber = values['ticket number'];
  const issuingAuthority = values['issuing authority'] ?? 'Fixed Penalty Office';
  const registrationNumber = values['registration number'];
  const drivingLicence = values['driving licence'];
  const ntoNumber = values['notice to owner or hirer number (nto/nth)'];
  const rawDateNoticeIssued = values['date notice to owner was issued'];
  const dateNoticeIssued = rawDateNoticeIssued
    ? parseToIsoDate(rawDateNoticeIssued, 'date notice to owner was issued')
    : undefined;
  const timeOfOffence = values['time of offence'] ?? '14:30';
  const placeOfOffence = values['place of offence'];
  const businessUnitId = resolveBusinessUnitId(values['business unit id']);
  const publishingUser = resolvePublishingUser(values);

  if (
    !companyName ||
    !ticketNumber ||
    !registrationNumber ||
    !drivingLicence ||
    !ntoNumber ||
    !dateNoticeIssued ||
    !placeOfOffence
  ) {
    throw new Error(
      'Expected company name, ticket number, registration number, driving licence, NTO/NTH number, date notice issued and place of offence for vehicle fixed penalty company seed.',
    );
  }

  const overrides = buildPublishedVehicleFixedPenaltyCompanyOverrides({
    businessUnitId,
    issuingAuthority,
    ticketNumber,
    companyName,
    registrationNumber,
    drivingLicence,
    ntoNumber,
    dateNoticeIssued,
    timeOfOffence,
    placeOfOffence,
  });

  log('step', 'Creating published vehicle fixed penalty company account', {
    companyName,
    ticketNumber,
    issuingAuthority,
    registrationNumber,
    drivingLicence,
    ntoNumber,
    dateNoticeIssued,
    timeOfOffence,
    placeOfOffence,
    businessUnitId,
    publishingUser,
  });

  return createPublishedDraftAccount('opalE2EFixedPenaltyCompany', overrides, publishingUser);
});

/**
 * @step Creates a published Welsh-speaking parent or guardian account.
 * @description
 * Seeds a `pgToPay` account at API level and sets it to `Publishing Pending`, applying Welsh
 * language preferences to the parent or guardian debtor detail so summary journeys can assert
 * the Language preferences section.
 *
 * Supported table keys:
 * - prosecutor case reference / pcr
 * - title
 * - first name / first names
 * - last name
 * - date of birth / dob
 * - business unit id
 * - parent or guardian title
 * - parent or guardian first name / first names
 * - parent or guardian last name
 * - document language / document language code
 * - court hearing language / hearing language / court hearing language code
 * - publishing user / approving user / approval user
 *
 * @example
 *   Given a published Welsh-speaking parent or guardian account exists:
 *     | first name                | Megan                  |
 *     | last name                 | SummaryWelshPG{uniq}   |
 *     | prosecutor case reference | PCRR1BWPG{uniqUpper}   |
 */
Given('a published Welsh-speaking parent or guardian account exists:', (table: DataTable) => {
  const values = parseSeedValues(table);

  const prosecutorCaseReference = values['prosecutor case reference'] ?? values['pcr'];
  const firstNames = values['first name'] ?? values['first names'];
  const lastName = values['last name'];
  const dateOfBirth = values['date of birth'] ?? values['dob'] ?? '2010-01-01';
  const title = values['title'] ?? 'Ms';
  const businessUnitId = resolveBusinessUnitId(values['business unit id']);
  const publishingUser = resolvePublishingUser(values);
  const parentGuardianTitle = values['parent or guardian title'] ?? 'Mrs';
  const parentGuardianFirstNames =
    values['parent or guardian first name'] ?? values['parent or guardian first names'] ?? 'Parent';
  const parentGuardianLastName = values['parent or guardian last name'] ?? `${lastName} Parent`;
  const documentLanguage = resolveLanguageCode(values['document language'] ?? values['document language code']);
  const hearingLanguage = resolveLanguageCode(
    values['court hearing language'] ?? values['hearing language'] ?? values['court hearing language code'],
  );

  if (!prosecutorCaseReference || !firstNames || !lastName) {
    throw new Error(
      'Expected prosecutor case reference, first name and last name for Welsh-speaking parent or guardian seed.',
    );
  }

  const overrides = {
    business_unit_id: businessUnitId,
    account: {
      originator_name: "North East Wales Magistrates' Court",
      prosecutor_case_reference: prosecutorCaseReference,
      collection_order_made: false,
      collection_order_made_today: false,
      payment_card_request: false,
      defendant: {
        title,
        forenames: firstNames,
        surname: lastName,
        dob: dateOfBirth,
        parent_guardian: {
          title: parentGuardianTitle,
          forenames: parentGuardianFirstNames,
          surname: parentGuardianLastName,
          debtor_detail: {
            document_language: documentLanguage,
            hearing_language: hearingLanguage,
          },
        },
      },
    },
  };

  log('step', 'Creating published Welsh-speaking parent or guardian account', {
    prosecutorCaseReference,
    firstNames,
    lastName,
    dateOfBirth,
    businessUnitId,
    parentGuardianFirstNames,
    parentGuardianLastName,
    documentLanguage,
    hearingLanguage,
    publishingUser,
  });

  return createPublishedDraftAccount('pgToPay', overrides, publishingUser);
});

/**
 * @step Creates a published account whose first imposition contains an individual minor creditor.
 * @description
 * Seeds a `pgToPay` account at API level and sets it to `Publishing Pending`, overriding the
 * first imposition's `minor_creditor` fields from a small search-oriented setup table.
 *
 * Supported table keys:
 * - prosecutor case reference
 * - title
 * - first name / first names
 * - last name
 * - address line 1
 * - postcode
 * - publishing user / approving user / approval user
 *
 * @example
 *   Given a published account exists with an individual minor creditor:
 *     | prosecutor case reference | PCRJRNYMIN{uniqUpper} |
 *     | first name                | Mina                  |
 *     | last name                 | JourneyMinor{uniq}    |
 *     | address line 1            | 1 High Street         |
 *     | postcode                  | MC1 1AA               |
 */
Given('a published account exists with an individual minor creditor:', (table: DataTable) => {
  const values = parseSeedValues(table);

  const prosecutorCaseReference = values['prosecutor case reference'] ?? values['pcr'];
  const firstNames = values['first name'] ?? values['first names'];
  const lastName = values['last name'];
  const addressLine1 = values['address line 1'];
  const postcode = values['postcode'];
  const title = values['title'] ?? 'Mr';
  const publishingUser = resolvePublishingUser(values);

  if (!prosecutorCaseReference || !firstNames || !lastName || !addressLine1 || !postcode) {
    throw new Error(
      'Expected prosecutor case reference, first name, last name, address line 1 and postcode for minor creditor',
    );
  }

  const overrides = {
    account: {
      prosecutor_case_reference: prosecutorCaseReference,
      defendant: {
        forenames: 'Minor',
        surname: `Creditor Seed ${lastName}`,
        parent_guardian: {
          dob: '1980-02-15',
        },
      },
      offences: [
        {
          impositions: [
            {
              minor_creditor: {
                company_flag: false,
                title,
                forenames: firstNames,
                surname: lastName,
                address_line_1: addressLine1,
                post_code: postcode,
              },
            },
          ],
        },
      ],
    },
  };

  log('step', 'Creating published account with individual minor creditor', {
    prosecutorCaseReference,
    firstNames,
    lastName,
    addressLine1,
    postcode,
    publishingUser,
  });

  return createPublishedDraftAccount('pgToPay', overrides, publishingUser);
});

/**
 * @step Creates a published account whose first imposition contains a company minor creditor.
 * @description
 * Seeds a `pgToPay` account at API level and sets it to `Publishing Pending`, overriding the
 * first imposition's company minor creditor fields from a small search-oriented setup table.
 *
 * Supported table keys:
 * - prosecutor case reference
 * - company name
 * - address line 1
 * - postcode
 * - publishing user / approving user / approval user
 *
 * @example
 *   Given a published account exists with a company minor creditor:
 *     | prosecutor case reference | PCRJRNYMINCO{uniqUpper} |
 *     | company name              | Journey Minor Co {uniq} |
 *     | address line 1            | 2 High Street           |
 *     | postcode                  | MC1 1AB                 |
 */
Given('a published account exists with a company minor creditor:', (table: DataTable) => {
  const values = parseSeedValues(table);

  const prosecutorCaseReference = values['prosecutor case reference'] ?? values['pcr'];
  const companyName = values['company name'];
  const addressLine1 = values['address line 1'];
  const postcode = values['postcode'];
  const publishingUser = resolvePublishingUser(values);

  if (!prosecutorCaseReference || !companyName || !addressLine1 || !postcode) {
    throw new Error(
      'Expected prosecutor case reference, company name, address line 1 and postcode for company minor creditor',
    );
  }

  const overrides = {
    account: {
      prosecutor_case_reference: prosecutorCaseReference,
      defendant: {
        forenames: 'Minor',
        surname: `Creditor Seed ${companyName}`,
        parent_guardian: {
          dob: '1980-02-15',
        },
      },
      offences: [
        {
          impositions: [
            {
              minor_creditor: {
                company_flag: true,
                company_name: companyName,
                address_line_1: addressLine1,
                post_code: postcode,
              },
            },
          ],
        },
      ],
    },
  };

  log('step', 'Creating published account with company minor creditor', {
    prosecutorCaseReference,
    companyName,
    addressLine1,
    postcode,
    publishingUser,
  });

  return createPublishedDraftAccount('pgToPay', overrides, publishingUser);
});

/**
 * @step Clears approved draft account listings to start from an empty state.
 * @description Stubs the approved drafts API to return zero results to avoid cross-test leakage.
 *
 * @example
 *   And I clear all approved accounts
 */
Given('I clear all approved accounts', () => {
  log('intercept', 'Clearing approved accounts');
  intercepts().clearApprovedListings();
});

/**
 * @step Open the Create and Manage Draft Accounts page.
 * @description Navigates from the dashboard to the inputter draft listings and asserts the header.
 * @example And I open Create and Manage Draft Accounts
 */
When('I open Create and Manage Draft Accounts', () => {
  log('navigate', 'Opening Create and Manage Draft Accounts');
  searchIndividuals().assertOnSearchLandingPage();
  primaryNavigation().chooseItem('Accounts');
  primaryNavigation().assertLandingPage('Accounts', '/fines/dashboard/accounts');
  inputter().openPageFromAccounts();
});

/**
 * @step Navigate directly to the Accounts dashboard.
 * @description Opens the Accounts dashboard route directly without going through primary navigation.
 */
When('I navigate directly to the Accounts dashboard', () => {
  log('navigate', 'Navigating directly to the Accounts dashboard');
  inputter().visitAccountsDashboardDirectly();
});

/**
 * @step Navigate directly to an Accounts dashboard entry point.
 * @description Opens the target draft-account route directly for feature-flag access checks.
 * @param entryPoint - Supported draft-account entry point label.
 */
When('I navigate directly to the Accounts dashboard entry point {string}', (entryPoint: DraftAccountEntryPoint) => {
  log('navigate', 'Navigating directly to Accounts dashboard entry point', { entryPoint });
  switch (entryPoint) {
    case 'Create and Manage Draft Accounts':
      inputter().visitPageDirectly();
      return;
    case 'Check and Validate Draft Accounts':
      checker().visitPageDirectly();
      return;
    default:
      throw new Error(`Unsupported draft-account entry point: ${entryPoint}`);
  }
});

/**
 * @step Click the Create account button on the Create and Manage Draft Accounts page.
 * @description Navigates from Create accounts to the Create new account or transfer in screen.
 */
When('I click the Create account button on Create and Manage Draft Accounts', () => {
  log('navigate', 'Clicking Create account button on Create and Manage Draft Accounts');
  inputter().clickCreateAccount();
});

/**
 * @step Use the back link on Create and Manage Draft Accounts.
 * @description Clicks the GOV.UK back link rendered on the draft listings page.
 * @example When I go back from Create and Manage Draft Accounts
 */
When('I go back to Create and Manage Draft Accounts', () => {
  log('navigate', 'Clicking back link on Create and Manage Draft Accounts');
  inputter().goBack();
});

/**
 * @step Use the back link on Check and Validate Draft Accounts.
 * @description Clicks the GOV.UK back link rendered on the checker draft pages.
 * @example When I go back to Check and Validate Draft Accounts
 */
When('I go back to Check and Validate Draft Accounts', () => {
  log('navigate', 'Clicking back link on Check and Validate Draft Accounts');
  checker().goBack();
});

/**
 * @step Update the most recently created draft account status.
 * @param status - Target status (e.g., "Deleted").
 * @example When I set the last created draft account status to "Deleted"
 */
When('I set the last created draft account status to {string}', (status: string) => {
  log('step', 'Setting last created draft status', { status });
  return updateLastCreatedDraftAccountStatus(status);
});

Then('the last draft update should return a new strong ETag', () => {
  log('assert', 'Asserting strong ETag for last draft update');
  return assertLatestDraftUpdateHasStrongEtag();
});

When('I attempt a stale If-Match update on the last draft account with status {string}', (status: string) => {
  log('step', 'Attempting stale If-Match update on last draft account', { status });
  return simulateStaleIfMatchConflict(status);
});

Then('the stale If-Match update should return a conflict', () => {
  log('assert', 'Asserting stale If-Match conflict');
  return assertStaleIfMatchConflict();
});

/**
 * @step Assert the status tag on a checker review page.
 * @param status - Expected status text (e.g., "In review").
 * @example Then the draft account status tag is "Rejected"
 */
Then('the draft account status tag is {string}', (status: string) => {
  log('assert', 'Asserting draft status tag', { status });
  checkerReview().assertStatusTag(status);
});

/**
 * @step Assert the checker tab heading text.
 * @param heading - Expected heading such as "To review" or "Deleted".
 * @example Then the checker status heading is "Deleted"
 */
Then('the checker status heading is {string}', (heading: string) => {
  log('assert', 'Asserting checker status heading', { heading });
  checker().assertStatusHeading(heading);
});

/**
 * @step Switch tab on the Create and Manage Draft Accounts page.
 * @description Clicks the specified tab on the inputter view.
 * @param tab - Tab name (e.g., "In review", "Rejected").
 * @example When I view the "Rejected" tab on the Create and Manage Draft Accounts page
 */
When('I view the {string} tab on the Create and Manage Draft Accounts page', (tab: CreateManageTab) => {
  log('navigate', 'Switching Create and Manage tab', { tab });
  inputter().switchTab(tab);
});

/**
 * @step Assert the approved draft account number is rendered as a hyperlink.
 * @param accountNumber - Account number expected in the Approved tab.
 */
Then('the approved draft account number {string} is shown as a hyperlink', (accountNumber: string) => {
  log('assert', 'Asserting approved draft account number is a hyperlink', { accountNumber });
  inputter().assertApprovedAccountNumberIsLink(accountNumber);
});

/**
 * @step Assert the approved draft account number is rendered as plain text.
 * @param accountNumber - Account number expected in the Approved tab.
 */
Then('the approved draft account number {string} is shown as plain text', (accountNumber: string) => {
  log('assert', 'Asserting approved draft account number is plain text', { accountNumber });
  inputter().assertApprovedAccountNumberIsPlainText(accountNumber);
});

/**
 * @step Switch tab on the Check and Validate page.
 * @description Clicks the specified tab on the checker view.
 * @param tab - Tab name (e.g., "To review", "Rejected").
 * @example When I view the "To review" tab on the Check and Validate page
 */
When('I view the {string} tab on the Check and Validate page', (tab: CheckAndValidateTab) => {
  log('navigate', 'Switching Check and Validate tab', { tab });
  checker().switchTab(tab);
});

/**
 * @step Assert a checker tab is active.
 * @description Verifies the specified Check and Validate tab has `aria-current="page"`.
 * @param tab - Tab name (e.g., "Failed", "To review").
 * @example Then the "Failed" tab on Check and Validate is active
 */
Then('the {string} tab on Check and Validate is active', (tab: CheckAndValidateTab) => {
  log('assert', 'Asserting Check and Validate tab is active', { tab });
  checker().assertTabActive(tab);
});

/**
 * @step Open the Check and Validate Draft Accounts page
 * @description Composite to navigate to the checker view and confirm the "Review accounts" header is visible.
 * @example When I open Check and Validate Draft Accounts
 */
When('I open Check and Validate Draft Accounts', () => {
  log('navigate', 'Opening Check and Validate Draft Accounts with header assert');
  draftsFlow().openCheckAndValidateWithHeader();
});

/**
 * @step Assert account type column text.
 * @description Verifies the draft listings table Account type column contains the expected text.
 * @param expected - Account type text to find.
 * @example Then I see "Fixed Penalty" in the account type column on the draft table
 */
Then('I see {string} in the account type column on the draft table', (expected: string) => {
  const normalized = withUniq(expected);
  log('assert', 'Checking account type column contains expected text', { expected: normalized });
  checker().assertAccountType(normalized);
});

/**
 * @step Sort the draft accounts table by the given column and direction.
 * @description Ensures the sortable header is set to ascending/descending before asserting rows.
 * @param column - Display column name to sort by.
 * @param direction - "ascending" or "descending".
 * @example And I sort the draft accounts table by column "Date failed" in "descending" order
 */
When(
  'I sort the draft accounts table by column {string} in {string} order',
  (column: DraftAccountsTableColumn, direction: 'ascending' | 'descending') => {
    const normalizedDirection = direction.trim().toLowerCase() as 'ascending' | 'descending';
    const allowed: Array<'ascending' | 'descending'> = ['ascending', 'descending'];
    if (!allowed.includes(normalizedDirection)) {
      throw new Error(`Unsupported sort direction: ${direction}`);
    }
    log('action', 'Sorting draft accounts table', { column, direction: normalizedDirection });
    checker().sortByColumn(column, normalizedDirection);
  },
);

/**
 * @step Open a draft account by defendant/company name.
 * @param defendantName - Visible name in the Defendant column.
 */
When('I open the draft account for defendant {string}', (defendantName: string) => {
  const name = withUniq(defendantName);
  log('navigate', 'Opening draft account by defendant', { defendantName: name });
  inputter().openDefendant(name);
});

/**
 * @step Open a draft account in checker view by defendant/company name.
 * @param defendantName - Visible name in the Defendant column.
 * @example And I view the draft account details for defendant "GREEN, Oliver"
 */
When('I view the draft account details for defendant {string}', (defendantName: string) => {
  const name = withUniq(defendantName);
  log('navigate', 'Opening checker draft account by defendant', { defendantName: name });
  checker().openDefendant(name);
});

/**
 * @step Open a draft account by account number (Approved tab).
 * @param accountNumber - Visible account number in the Account column.
 */
When('I open the draft account number {string}', (accountNumber: string) => {
  log('navigate', 'Opening draft account by account number', { accountNumber });
  inputter().openAccountNumber(accountNumber);
});

/**
 * @step Follow the View all rejected accounts link.
 */
When('I view all rejected draft accounts', () => {
  log('navigate', 'Opening View all rejected accounts');
  inputter().openViewAllRejected();
});

/**
 * @step Use the back link to return from the View all rejected accounts page.
 */
When('I return to the rejected accounts tab', () => {
  log('navigate', 'Returning to rejected accounts tab');
  inputter().returnFromViewAllRejected();
});

/**
 * @step Open a draft account in checker view and assert the header.
 * @param defendantName - Defendant/company to click.
 * @param expectedHeader - Header text expected after navigation.
 */
Then(
  'I open the draft account for {string} and see header {string}',
  (defendantName: string, expectedHeader: string) => {
    const name = withUniq(defendantName);
    const header = withUniq(expectedHeader);
    log('navigate', 'Opening draft and asserting header', { defendantName: name, expectedHeader: header });
    draftsFlow().openDraftAndAssertHeader(name, header);
  },
);

/**
 * @step Assert the draft review page header and status tag after navigation.
 * @param header - Expected page header text.
 * @param status - Expected status tag (e.g., "In review").
 */
Then('I should be back on the page {string} with status {string}', (header: string, status: string) => {
  const normalizedHeader = withUniq(header);
  log('assert', 'Asserting draft review header and status tag', { header: normalizedHeader, status });
  draftsFlow().assertReviewHeaderAndStatus(normalizedHeader, status);
});

/**
 * @step Assert the checker header and status heading together.
 * @param header - Expected page header text.
 * @param statusHeading - Expected status heading (e.g., "To review").
 */
Then(
  'I should see the checker header {string} and status heading {string}',
  (header: string, statusHeading: string) => {
    const normalizedHeader = withUniq(header);
    log('assert', 'Asserting checker header and status heading', {
      header: normalizedHeader,
      statusHeading,
    });
    draftsFlow().assertHeaderAndStatusHeading(normalizedHeader, statusHeading);
  },
);

/**
 * @step Assert sortable table headings.
 * @param table - Single-column table of heading labels in order.
 */
Then('the manual draft table headings are:', (table: DataTable) => {
  const headings = table
    .rows()
    .map(([heading]) => withUniq(heading.trim()))
    .filter(Boolean);
  log('assert', 'Draft table headings', { headingsList: headings });
  checker().assertHeadings(headings);
});

/**
 * @step Assert a row contains expected values in order.
 * @param position - 1-based row index.
 * @param table - Single-column table of expected cell text.
 */
Then('the manual draft table row {int} contains:', (position: number, table: DataTable) => {
  const expectedValues = table
    .rows()
    .map(([value]) => withUniq(value.trim()))
    .filter(Boolean);
  log('assert', 'Draft table row values', { position, expectedValues });
  inputter().assertRowValues(position, expectedValues);
});

/**
 * @step Assert a row contains specific column/value pairs (unordered).
 * @param position - 1-based row index.
 * @param table - Two-column table: Column | Value.
 */
Then('the manual draft table row {int} has values:', (position: number, table: DataTable) => {
  const expectations = Object.fromEntries(
    table
      .rows()
      .map(([column, value]) => [column.trim(), withUniq(value.trim())])
      .filter(([column]) => Boolean(column)),
  );
  log('assert', 'Draft table row column values', { position, expectations });
  inputter().assertRowColumns(position, expectations as any);
});

/**
 * @step Assert that the row matching a column value has the provided column/value pairs.
 * @param matchValue - Text to find within the matchColumn.
 * @param matchColumn - Column used to locate the row (e.g., "Defendant").
 * @param table - Two-column table: Column | Value.
 */
Then(
  'the manual draft table row containing {string} in column {string} has values:',
  (matchValue: string, matchColumn: DraftAccountsTableColumn, table: DataTable) => {
    const expectations = Object.fromEntries(
      table
        .rows()
        .map(([column, value]) => [column.trim(), withUniq(value.trim())])
        .filter(([column]) => Boolean(column)),
    );
    const normalizedMatch = withUniq(matchValue);
    log('assert', 'Draft table row values by match', { matchColumn, matchValue: normalizedMatch, expectations });
    checker().assertRowByMatch(matchColumn, normalizedMatch, expectations as any);
  },
);

/**
 * @step Assert that a column contains the provided text.
 * @param column - Column label (e.g., "Defendant", "Account type").
 * @param expectedText - Text to search for within the column cells.
 */
Then('I see {string} in the manual draft column {string}', (expectedText: string, column: string) => {
  const normalized = withUniq(expectedText);
  log('assert', 'Draft table column contains text', { column, expectedText: normalized });
  inputter().assertColumnContains(
    column as Parameters<CreateManageDraftsActions['assertColumnContains']>[0],
    normalized,
  );
});

/**
 * @step Assert that the draft accounts table contains text in a column (checker view).
 * @param expectedText - Text to search for.
 * @param column - Column label.
 */
Then('the draft accounts table should contain {string} in column {string}', (expectedText: string, column: string) => {
  const normalized = withUniq(expectedText);
  log('assert', 'Checker draft table column contains text', { column, expectedText: normalized });
  checker().assertColumnContains(column as DraftAccountsTableColumn, normalized);
});

/**
 * @step Open a draft account based on a matching cell value.
 * @description Finds the first row where the specified column contains the provided text and opens that draft account.
 * @param expectedText - Text to match within the target column.
 * @param column - Column label to search (e.g., "Defendant", "Account type").
 */
When(
  'I open the draft account in row containing {string} in the manual draft column {string}',
  (expectedText: string, column: string) => {
    // Refresh to force a fresh API fetch and table render before matching; avoids stale/paginated views.
    cy.reload();
    const normalized = withUniq(expectedText);
    log('navigate', 'Opening draft account by column match', { column, expectedText: normalized });
    cy.log(`Matching draft row → column: ${column}, expected: ${normalized}`);
    inputter().openFirstMatchInColumn(
      column as Parameters<CreateManageDraftsActions['openFirstMatchInColumn']>[0],
      normalized,
    );
  },
);

/**
 * @step Switches to the specified inputter draft tab.
 * @description Clicks the tab by name within the inputter draft accounts view.
 * @param tab - Tab name (e.g., "In review").
 */
When('I view the inputter draft tab {string}', (tab: InputterTab) => {
  log('navigate', 'Switching inputter tab', { tab });
  tabs().switchInputterTab(tab);
});

/**
 * @step Switches to the specified checker draft tab.
 * @description Clicks the tab by name within the checker draft accounts view.
 * @param tab - Tab name (e.g., "To review").
 */
When('I view the checker draft tab {string}', (tab: CheckerTab) => {
  log('navigate', 'Switching checker tab', { tab });
  tabs().switchCheckerTab(tab);
});
