/**
 * @file account-enquiry.steps.ts
 * @description
 * Cucumber step definitions for **Account Enquiry** end-to-end flows.
 *
 * These steps integrate high-level flows (e.g., `AccountEnquiryFlow`)
 * with lower-level Actions (e.g., `AccountDetailsDefendantActions`),
 * providing natural-language mappings for Cucumber `.feature` files.
 *
 * @remarks
 * - The step definitions are intentionally **thin wrappers** that delegate logic
 *   to reusable flow/action classes.
 * - Each step mirrors the human-readable Gherkin phrasing while maintaining traceable logs.
 * - Tasks (e.g., `clearApprovedDrafts`, `createAndPublishAccount`) are run via Cypress plugins.
 */

import { When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { AccountEnquiryFlow } from '../../..//e2e/functional/opal/flows/account-enquiry.flow';
import { CommonFlow } from '../../..//e2e/functional/opal/flows/common-flow';

// Actions
import { AccountDetailsAtAGlanceActions } from '../../..//e2e/functional/opal/actions/account-details/details.at-a-glance.actions';
import { CommonActions } from '../../..//e2e/functional/opal/actions/common/common.actions';
import { EditDefendantDetailsActions } from '../../..//e2e/functional/opal/actions/account-details/edit.defendant-details.actions';
import { EditCompanyDetailsActions } from '../../..//e2e/functional/opal/actions/account-details/edit.company-details.actions';
import { AccountDetailsNavActions } from '../../..//e2e/functional/opal/actions/account-details/details.nav.actions';
import { EditParentGuardianDetailsActions } from '../../..//e2e/functional/opal/actions/account-details/edit.parent-guardian-details.actions';
import { AccountDetailsFixedPenaltyActions } from '../../..//e2e/functional/opal/actions/account-details/details.fixed-penalty.actions';
import { log } from '../../utils/log.helper';
import { applyUniqPlaceholder } from '../../utils/stringUtils';
import { normalizeHash, normalizeTableRows } from '../../utils/cucumberHelpers';

// Factory functions so each step gets a fresh instance with its own Cypress chain
const flow = () => new AccountEnquiryFlow();
const commonFlow = () => new CommonFlow();
const atAGlanceDetails = () => new AccountDetailsAtAGlanceActions();
const common = () => new CommonActions();
const editDefendantDetails = () => new EditDefendantDetailsActions();
const editCompanyDetails = () => new EditCompanyDetailsActions();
const editParentGuardianDetails = () => new EditParentGuardianDetailsActions();
const fixedPenaltyDetails = () => new AccountDetailsFixedPenaltyActions();
const navActions = () => new AccountDetailsNavActions();

type CommentRow = { [key: string]: string };

import { rowsHashSafe } from '../../utils/table';

/**
 * @step Selects the latest account and verifies the header.
 */
When('I select the latest published account and verify the header is {string}', (header: string) => {
  const resolvedHeader = applyUniqPlaceholder(header);
  log('step', 'Selecting latest published account', { expectedHeader: resolvedHeader });
  flow().openLatestAndAssertHeader(resolvedHeader);
});

/**
 * @step Searches for an account by last name using the AccountEnquiryFlow.
 */
When('I search for the account by last name {string}', (surname: string) => {
  const surnameWithUniq = applyUniqPlaceholder(surname);
  log('step', 'Searching by surname', { surname: surnameWithUniq });
  flow().searchBySurname(surnameWithUniq);
});

/**
 * @step Search by surname and assert the At a glance header.
 * @example
 *  When I search for the account by last name "Smith" and verify the page header is "At a glance"
 */
When(
  'I search for the account by last name {string} and verify the page header is {string}',
  (surname: string, header: string) => {
    const surnameWithUniq = applyUniqPlaceholder(surname);
    const headerWithUniq = applyUniqPlaceholder(header);
    log('step', 'Search by surname and verify header', { surname: surnameWithUniq, expectedHeader: headerWithUniq });
    flow().searchOpenLatestAndAssertHeader(surnameWithUniq, headerWithUniq);
  },
);

/**
 * @step Explicit variant — performs the similar behaviour as above but actually
 * “opens the latest result”
 */
When('I search for the account by last name {string} and open the latest result', (surname: string) => {
  const surnameWithUniq = applyUniqPlaceholder(surname);
  log('step', 'Search by surname and open latest result', { surname: surnameWithUniq });
  flow().searchAndClickLatestBySurnameOpenLatestResult(surnameWithUniq);
});

/**
 * @step Opens the latest matching account from the current Search results page.
 *
 * @remarks
 * - Intended for journey scenarios where the results page has already been asserted.
 * - Delegates to the shared AccountEnquiryFlow/ResultsActions open helper.
 */
When('I open the latest matching result from the search results', () => {
  log('step', 'Opening latest matching result from search results');
  flow().openMostRecentFromResults();
});

/**
 * @step Opens the latest matching account from the Companies tab on the Search results page.
 */
When('I open the latest matching result from the Companies search results', () => {
  log('step', 'Opening latest matching result from Companies search results');
  flow().openMostRecentFromCompaniesResults();
});

/**
 * @step Navigates directly to the most recently created published account details route.
 */
When('I navigate directly to the last created published account details', () => {
  log('step', 'Navigating directly to the last created published account details');
  flow().visitLastCreatedPublishedAccountDetails();
});

/**
 * @step Verifies that any page/account/summary header contains the given string.
 *
 * @remarks
 * - Provides multiple natural-language aliases for the same assertion.
 * - Delegates to {@link AccountDetailsDefendantActions.assertHeaderContains}.
 *
 * @example
 *   Then I should see the page header contains "Comments"
 *   Then I should see the account header contains "Mr John ACCDETAILSURNAME"
 *   Then I should see the account summary header contains "Mr John ACCDETAILSURNAME"
 */
Then(/^I should see the (?:page|account(?: summary)?) header contains "([^"]+)"$/, (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('assert', 'Asserting header contains', { expected: expectedWithUniq });
  atAGlanceDetails().assertHeaderContains(expectedWithUniq);
});

/**
 * @step Navigates to the Defendant details section and validates the header text.
 *
 * @param expected - Expected header text for the section.
 */
When('I go to the Defendant details section and the header is {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('step', 'Navigate to Defendant details', { expected: expectedWithUniq });
  flow().goToDefendantDetailsAndAssert(expectedWithUniq);
});

Then('I should see the convert to company account action', () => {
  log('assert', 'Convert to company account action is visible');
  flow().assertConvertToCompanyActionVisible();
});

Then('I should see the convert to individual account action', () => {
  log('assert', 'Convert to individual account action is visible');
  flow().assertConvertToIndividualActionVisible();
});

Then('I should not see the convert to company account action', () => {
  log('assert', 'Convert to company account action is absent');
  flow().assertConvertToCompanyActionNotPresent();
});

Then('I should not see the convert to company account text', () => {
  log('assert', 'Convert to company account text is absent from the visible action');
  flow().assertConvertToCompanyActionTextNotPresent();
});

When('I start converting the account to a company account', () => {
  log('step', 'Start converting account to company');
  flow().openConvertToCompanyConfirmation();
});

Then(
  'I should see the convert to company confirmation screen for defendant {string}',
  (expectedCaptionName: string) => {
    const expectedCaptionNameWithUniq = applyUniqPlaceholder(expectedCaptionName);
    log('assert', 'Convert to company confirmation screen is visible', {
      expectedCaptionName: expectedCaptionNameWithUniq,
    });
    flow().assertOnConvertToCompanyConfirmation(expectedCaptionNameWithUniq);
  },
);

When('I continue converting the account to a company account', () => {
  log('step', 'Continue converting account to company');
  flow().confirmConvertToCompanyAccount();
});

Then('I should be on the Company details convert route', () => {
  log('assert', 'Company details convert route is active');
  flow().assertOnCompanyDetailsConvertRoute();
});

When('I cancel converting the account to a company account', () => {
  log('step', 'Cancel converting account to company');
  flow().cancelConvertToCompanyAccount();
});

Then('the Company details form should be pre-populated with:', (table: DataTable) => {
  const expectedFieldValues = Object.fromEntries(
    Object.entries(rowsHashSafe(table)).map(([fieldName, fieldValue]) => [fieldName, applyUniqPlaceholder(fieldValue)]),
  );
  log('assert', 'Company details form is pre-populated', expectedFieldValues);
  flow().assertCompanyDetailsPrefilledValues(expectedFieldValues);
});

When('I start converting the account to an individual account', () => {
  log('step', 'Start converting account to individual');
  flow().openConvertToIndividualConfirmation();
});

Then(
  'I should see the convert to individual confirmation screen for company {string}',
  (expectedCaptionName: string) => {
    const expectedCaptionNameWithUniq = applyUniqPlaceholder(expectedCaptionName);
    log('assert', 'Convert to individual confirmation screen is visible', {
      expectedCaptionName: expectedCaptionNameWithUniq,
    });
    flow().assertOnConvertToIndividualConfirmation(expectedCaptionNameWithUniq);
  },
);

When('I continue converting the account to an individual account', () => {
  log('step', 'Continue converting account to individual');
  flow().confirmConvertToIndividualAccount();
});

Then('I should be on the Defendant details convert route', () => {
  log('assert', 'Defendant details convert route is active');
  flow().assertOnDefendantDetailsConvertRoute();
});

When('I cancel converting the account to an individual account', () => {
  log('step', 'Cancel converting account to individual');
  flow().cancelConvertToIndividualAccount();
});

Then('the Defendant details form should be pre-populated with:', (table: DataTable) => {
  const expectedFieldValues = Object.fromEntries(
    Object.entries(rowsHashSafe(table)).map(([fieldName, fieldValue]) => [fieldName, applyUniqPlaceholder(fieldValue)]),
  );
  log('assert', 'Defendant details form is pre-populated', expectedFieldValues);
  flow().assertDefendantDetailsPrefilledValues(expectedFieldValues);
});

When('I complete converting the account to a company with company name {string}', (companyName: string) => {
  const companyNameWithUniq = applyUniqPlaceholder(companyName);
  log('step', 'Complete converting account to company', { companyName: companyNameWithUniq });
  flow().completeConvertToCompany(companyNameWithUniq);
});

When(
  'I complete converting the account to an individual with title {string}, first name {string}, and last name {string}',
  (title: string, firstName: string, lastName: string) => {
    const firstNameWithUniq = applyUniqPlaceholder(firstName);
    const lastNameWithUniq = applyUniqPlaceholder(lastName);
    log('step', 'Complete converting account to individual', {
      title,
      firstName: firstNameWithUniq,
      lastName: lastNameWithUniq,
    });
    flow().completeConvertToIndividual({
      title,
      firstName: firstNameWithUniq,
      lastName: lastNameWithUniq,
    });
  },
);

Then('I should see the account conversion success message {string}', (expected: string) => {
  log('assert', 'Account conversion success message is visible', { expected });
  flow().assertAccountConversionSuccessMessage(expected);
});

Then('I should see the company summary card', () => {
  log('assert', 'Company summary card is visible');
  flow().assertCompanySummaryVisible();
});

Then('I should not see the company summary card', () => {
  log('assert', 'Company summary card is absent');
  flow().assertCompanySummaryNotPresent();
});

Then('I should see the defendant summary card', () => {
  log('assert', 'Defendant summary card is visible');
  flow().assertDefendantSummaryVisible();
});

Then('I should not see the defendant summary card', () => {
  log('assert', 'Defendant summary card is absent');
  flow().assertDefendantSummaryNotPresent();
});

Then('I should see the primary email address contains {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('assert', 'Primary email address contains', { expected: expectedWithUniq });
  flow().assertPrimaryEmailContains(expectedWithUniq);
});

/**
 * @step Navigates to the Parent or guardian details section and validates the header text.
 *
 * @param expected - Expected header text for the section.
 */
When('I go to the Parent or guardian details section and the header is {string}', (expected: string) => {
  log('step', 'Navigate to Parent/Guardian details', { expected });
  flow().goToParentGuardianDetailsAndAssert(expected);
});

/**
 * @step Navigates to the Fixed penalty section and validates the header text.
 *
 * @param expected - Expected header text for the section.
 */
When('I go to the Fixed penalty section and the header is {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('step', 'Navigate to Fixed penalty details', { expected: expectedWithUniq });
  flow().goToFixedPenaltyDetailsAndAssert(expectedWithUniq);
});

/**
 * @step Navigates to the Payment terms tab.
 */
When('I go to the Payment terms tab', () => {
  log('step', 'Navigate to Payment terms tab');
  flow().goToPaymentTermsTab();
});

/**
 * @step Opens the amend payment terms form.
 */
When('I open the amend payment terms form', () => {
  log('step', 'Open amend payment terms form');
  flow().openPaymentTermsAmendForm();
});

/**
 * @step Navigates to the Enforcement tab.
 */
When('I go to the Enforcement tab', () => {
  log('step', 'Navigate to Enforcement tab');
  flow().goToEnforcementTab();
});

/**
 * @step Opens the add enforcement override form from the Enforcement tab.
 */
When('I open the add enforcement override form', () => {
  log('step', 'Open add enforcement override form');
  flow().openAddEnforcementOverrideForm();
});

/**
 * @step Opens the add enforcement action form from the Enforcement tab.
 */
When('I open the add enforcement action form', () => {
  log('step', 'Open add enforcement action form');
  flow().openAddEnforcementActionForm();
});

/**
 * @step Opens the Change Collection Order status form from the Enforcement tab.
 */
When('I open the Change Collection Order status form', () => {
  log('step', 'Open Change Collection Order status form');
  flow().openChangeCollectionOrderForm();
});

/**
 * @step Verifies the Change Collection Order status page is visible.
 */
Then('I should see the Change Collection Order status page', () => {
  log('assert', 'Change Collection Order status page is visible');
  flow().assertChangeCollectionOrderFormVisible();
});

/**
 * @step Verifies the account identifier shown on the Change Collection Order status page.
 */
Then('I should see the account identifier {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('assert', 'Change Collection Order account identifier', { expected: expectedWithUniq });
  flow().assertChangeCollectionOrderAccountIdentifier(expectedWithUniq);
});

/**
 * @step Selects the requested Collection Order status option on the change form.
 */
When('I select {string} for Collection Order status', (option: string) => {
  log('step', 'Select Collection Order status', { option });
  flow().selectChangeCollectionOrderStatus(option);
});

/**
 * @step Submits the Change Collection Order status form.
 */
When('I submit the Change Collection Order status form', () => {
  log('step', 'Submit Change Collection Order status form');
  flow().submitChangeCollectionOrderForm();
});

/**
 * @step Cancels the Change Collection Order status form without making changes.
 */
When('I cancel the Change Collection Order status form without making changes', () => {
  log('step', 'Cancel Change Collection Order status form without changes');
  flow().cancelChangeCollectionOrderFormWithoutChanges();
});

/**
 * @step Cancels the Change Collection Order status form and chooses to stay on the page.
 */
When('I cancel the Change Collection Order status form and choose to stay', () => {
  log('step', 'Cancel Change Collection Order status form and choose to stay');
  flow().cancelChangeCollectionOrderFormAndStay();
});

/**
 * @step Verifies the Collection Order success banner text.
 */
Then('I should see the collection order success banner {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('assert', 'Collection Order success banner text', { expected: expectedWithUniq });
  flow().assertCollectionOrderSuccessBanner(expectedWithUniq);
});

/**
 * @step Verifies the Collection Order summary value shown on the Enforcement tab.
 */
Then('the collection order summary should show {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('assert', 'Collection Order summary value', { expected: expectedWithUniq });
  flow().assertCollectionOrderSummary(expectedWithUniq);
});

/**
 * @step Verifies we remain on the Change Collection Order status page.
 */
Then('I should remain on the Change Collection Order status page', () => {
  log('assert', 'Remain on Change Collection Order status page');
  flow().assertChangeCollectionOrderFormVisible();
});

/**
 * @step Selects an enforcement override on the add form.
 */
When('I choose the enforcement override {string}', (resultCode: string) => {
  log('step', 'Choose enforcement override', { resultCode });
  flow().selectEnforcementOverride(resultCode);
});

/**
 * @step Selects a Local Justice Area on the add form.
 */
When('I choose the Local Justice Area {string}', (localJusticeArea: string) => {
  log('step', 'Choose Local Justice Area', { localJusticeArea });
  flow().selectEnforcementOverrideLocalJusticeArea(localJusticeArea);
});

/**
 * @step Selects an enforcer on the add form.
 */
When('I choose the enforcer {string}', (enforcer: string) => {
  log('step', 'Choose enforcer', { enforcer });
  flow().selectEnforcementOverrideEnforcer(enforcer);
});

/**
 * @step Submits the add enforcement override form.
 */
When('I add the enforcement override', () => {
  log('step', 'Submit add enforcement override form');
  flow().submitAddEnforcementOverride();
});

/**
 * @step Completes the add enforcement override form with the provided values and submits it.
 */
When(
  'I add the enforcement override {string} with the Local Justice Area {string}',
  (resultCode: string, lja: string) => {
    log('step', 'Add enforcement override with Local Justice Area', { resultCode, lja });
    flow().selectEnforcementOverride(resultCode);
    flow().selectEnforcementOverrideLocalJusticeArea(lja);
    flow().submitAddEnforcementOverride();
  },
);

/**
 * @step Completes the add enforcement override form with the provided values and submits it.
 */
When('I add the enforcement override {string} with the enforcer {string}', (resultCode: string, enforcer: string) => {
  log('step', 'Add enforcement override with enforcer', { resultCode, enforcer });
  flow().selectEnforcementOverride(resultCode);
  flow().selectEnforcementOverrideEnforcer(enforcer);
  flow().submitAddEnforcementOverride();
});

/**
 * @step Opens the change enforcement court form from the Enforcement tab.
 */
When('I open the change enforcement court form', () => {
  log('step', 'Open change enforcement court form');
  flow().openChangeEnforcementCourtForm();
});

/**
 * @step Changes the enforcement court to a different available value.
 */
When('I change the enforcement court to a different value', () => {
  log('step', 'Change enforcement court to a different value');
  flow().changeEnforcementCourtToDifferentValue();
});

/**
 * @step Saves the currently displayed enforcement court value again.
 */
When('I save the same enforcement court value again', () => {
  log('step', 'Save the same enforcement court value again');
  flow().saveSameEnforcementCourtValueAgain();
});

/**
 * @step Cancels the change enforcement court form after selecting a value and confirms leaving.
 */
When('I cancel the change enforcement court form after selecting a value and discarding changes', () => {
  log('step', 'Cancel dirty change enforcement court form and discard changes');
  flow().cancelDirtyChangeEnforcementCourtAndDiscardChanges();
});

/**
 * @step Cancels the add enforcement override form and discards changes.
 */
When('I cancel the add enforcement override form and discard changes', () => {
  log('step', 'Cancel add enforcement override form and discard changes');
  flow().cancelAddEnforcementOverrideAndDiscardChanges();
});

/**
 * @step Submits instalments-only payment terms with a payment card request.
 */
When('I submit instalments only payment terms with a payment card request', () => {
  log('step', 'Submit instalments-only payment terms with card request');
  flow().submitInstalmentsOnlyPaymentTermsWithCardRequest();
});

/**
 * @step Cancels the amend payment terms form.
 */
When('I cancel payment terms amendments', () => {
  log('step', 'Cancel payment terms amendments');
  flow().cancelPaymentTermsAmendment();
});

/**
 * @step Asserts the At a glance tab is active.
 */
Then('the At a glance tab should be selected by default', () => {
  log('assert', 'At a glance tab is active by default');
  navActions().assertAtAGlanceTabIsActive();
});

/**
 * @step Asserts the Fixed penalty tab is visible on the account details page.
 */
Then('I should see the Fixed penalty tab', () => {
  log('assert', 'Fixed penalty tab is visible');
  navActions().assertFixedPenaltyTabIsVisible();
});

/**
 * @step Asserts the expected read-only sections are visible on the At a glance tab.
 */
Then('I should see the read only sections on the At a glance tab:', (table: DataTable) => {
  const rows = normalizeTableRows(table);
  const expectedSections = rows.map((row) => row[0] ?? '').filter(Boolean);

  log('assert', 'Asserting read only sections on the At a glance tab', { expectedSections });
  atAGlanceDetails().assertReadOnlySections(expectedSections);
});

/**
 * @step Asserts the account header summary values displayed above the details tabs.
 */
Then('I should see the account header summary values:', (table: DataTable) => {
  const expectedValues = normalizeHash(table);

  log('assert', 'Asserting account header summary values', { expectedValues });
  atAGlanceDetails().assertAccountHeaderSummaryValues(expectedValues);
});

/**
 * @step Asserts the fixed-penalty detail values shown on the Fixed penalty tab.
 */
Then('I should see the fixed penalty details:', (table: DataTable) => {
  const expectedValues = normalizeHash(table);

  log('assert', 'Asserting fixed penalty details', { expectedValues });
  fixedPenaltyDetails().assertDetails(expectedValues);
});

/**
 * @step Asserts the vehicle-only fixed-penalty fields are not shown on the Fixed penalty tab.
 */
Then('I should not see the vehicle fixed penalty fields', () => {
  log('assert', 'Asserting vehicle fixed penalty fields are absent');
  fixedPenaltyDetails().assertVehicleFieldsNotPresent();
});

/**
 * @step Asserts the language preferences shown on the At a glance tab.
 */
Then('I should see the following language preferences on the At a glance tab:', (table: DataTable) => {
  const expectedValues = normalizeHash(table);

  log('assert', 'Asserting language preferences on the At a glance tab', { expectedValues });
  atAGlanceDetails().assertLanguagePreferences(expectedValues);
});

/**
 * @step Asserts selected values shown on the minor creditor At a glance tab.
 */
Then('I should see the following minor creditor values on the At a glance tab:', (table: DataTable) => {
  const expectedValues = normalizeHash(table);

  log('assert', 'Asserting selected values on the minor creditor At a glance tab', { expectedValues });
  atAGlanceDetails().assertMinorCreditorAtAGlanceValues(expectedValues);
});

/**
 * @step Asserts the payment terms tab is active.
 */
Then('I should return to the Payment terms tab', () => {
  log('assert', 'Payment terms tab is active');
  flow().assertPaymentTermsTabIsActive();
});

/**
 * @step Asserts the Enforcement tab is active.
 */
Then('I should return to the Enforcement tab', () => {
  log('assert', 'Enforcement tab is active');
  flow().assertEnforcementTabIsActive();
});

/**
 * @step Navigates to the Impositions tab.
 */
When('I go to the Impositions tab', () => {
  log('step', 'Navigate to Impositions tab');
  navActions().goToImpositionsTab();
});

/**
 * @step Asserts the Impositions tab is active.
 */
Then('I should return to the Impositions tab', () => {
  log('assert', 'Impositions tab is active');
  navActions().assertImpositionsTabIsActive();
});

/**
 * @step Asserts the enforcement override success banner text.
 */
Then('the enforcement override success banner is {string}', (expected: string) => {
  log('assert', 'Enforcement override success banner text', { expected });
  flow().assertEnforcementOverrideSuccessBanner(expected);
});

/**
 * @step Asserts the enforcement court success banner text.
 */
Then('the enforcement court success banner is {string}', (expected: string) => {
  log('assert', 'Enforcement court success banner text', { expected });
  flow().assertEnforcementCourtSuccessBanner(expected);
});

/**
 * @step Asserts the selected enforcement court value is shown in the summary row.
 */
Then('the enforcement court summary shows the selected value', () => {
  log('assert', 'Selected enforcement court summary value');
  flow().assertSelectedEnforcementCourtSummary();
});

/**
 * @step Asserts no enforcement success banner is displayed.
 */
Then('the enforcement success banner is not displayed', () => {
  log('assert', 'Enforcement success banner is not displayed');
  flow().assertEnforcementSuccessBannerNotVisible();
});

/**
 * @step Asserts the intercepted enforcement override save request body.
 */
Then('the enforcement override save request shows:', (table: DataTable) => {
  const rows = rowsHashSafe(table);
  const overrideId =
    rows['enforcement override result id'] ?? rows['enforcement override'] ?? rows['override result id'] ?? '';
  const enforcerId = rows['enforcer id'] ?? '';
  const ljaId = rows['lja id'] ?? rows['local justice area id'] ?? '';

  log('assert', 'Enforcement override save request payload', { overrideId, enforcerId, ljaId });
  flow().assertEnforcementOverrideSaveRequest({ overrideId, enforcerId, ljaId });
});

/**
 * @step Asserts the enforcement override summary card values.
 */
Then('the enforcement override summary shows:', (table: DataTable) => {
  const rows = rowsHashSafe(table);
  const override = rows['enforcement override'] ?? '';
  const enforcer = rows['enforcer'] ?? '';
  const lja = rows['local justice area'] ?? rows['local justice area (lja)'] ?? '';

  log('assert', 'Enforcement override summary values', { override, enforcer, lja });
  flow().assertEnforcementOverrideSummary({ override, enforcer, lja });
});

/**
 * @step Asserts payment terms instalment summary values.
 */
Then('the payment terms summary shows instalments:', (table: DataTable) => {
  const rows = rowsHashSafe(table);
  const amount = rows['instalment amount'] ?? rows['instalment'] ?? '';
  const frequency = rows['frequency'] ?? '';
  const startDate = rows['start date'] ?? '';

  log('assert', 'Asserting payment terms instalment summary', { amount, frequency, startDate });
  flow().assertPaymentTermsInstalmentsSummary({ amount, frequency, startDate });
});

/**
 * @step Asserts pay by date on the payment terms tab.
 */
Then('the payment terms pay by date is {string}', (expected: string) => {
  log('assert', 'Asserting payment terms pay by date', { expected });
  flow().assertPaymentTermsPayByDate(expected);
});

/**
 * @step Asserts instalment rows are not shown on the payment terms tab.
 */
Then('the payment terms instalment rows are not shown', () => {
  log('assert', 'Asserting payment terms instalment rows absent');
  flow().assertPaymentTermsInstalmentsAbsent();
});

/**
 * @step Asserts the payment terms save request includes a payment card request.
 */
Then('the payment terms save request should include a payment card request', () => {
  log('assert', 'Asserting payment terms save request includes card request');
  flow().assertPaymentTermsSaveRequestedPaymentCard();
});

/**
 * @step Verifies last enforcement is cleared after payment terms save.
 */
Then('the payment terms last enforcement is cleared', () => {
  log('assert', 'Verifying payment terms last enforcement cleared');
  flow().verifyPaymentTermsLastEnforcementCleared();
});

/**
 * @step Edits the Defendant details, changing the First name to a given value.
 *
 * @param value - New First name to enter.
 */
When('I edit the Defendant details and change the First name to {string}', (value: string) => {
  log('step', 'Edit Defendant first name', { value });
  flow().editDefendantAndChangeFirstName(value);
});

/**
 * @step Opens Defendant details for editing without applying any changes.
 */
When('I edit the Defendant details without making changes', () => {
  log('step', 'Edit Defendant details without making changes');
  flow().editDefendantWithoutChanges();
});

/**
 * @step Edits the Parent or guardian details, changing the First name to a given value.
 *
 * @param value - New First name to enter.
 */
When('I edit the Parent or guardian details and change the First name to {string}', (value: string) => {
  log('step', 'Edit Parent/Guardian first name', { value });
  flow().editParentGuardianAndChangeFirstName(value);
});

/**
 * @step Opens Parent or guardian details for editing without applying changes.
 */
When('I edit the Parent or guardian details without making changes', () => {
  log('step', 'Edit Parent or guardian details without making changes');
  flow().editParentGuardianDetailsWithoutChanges();
});

/**
 * @step Edits the Company details, changing the Company name to a given value.
 *
 * @param value - New company name to enter.
 */
When('I edit the Company details and change the Company name to {string}', (value: string) => {
  const valueWithUniq = applyUniqPlaceholder(value);
  log('step', 'Edit Company name', { value: valueWithUniq });
  flow().editCompanyDetailsAndChangeName(valueWithUniq);
});

/**
 * @step Opens Company details for editing without applying changes.
 */
When('I edit the Company details without making changes', () => {
  log('step', 'Edit Company details without making changes');
  flow().editCompanyDetailsWithoutChanges();
});

/**
 * @step Saves edits on the Defendant details form.
 */
When('I save the defendant details', () => {
  log('step', 'Save defendant details');
  flow().saveDefendantDetails();
});

/**
 * @step Saves edits on the Parent or guardian details form.
 */
When('I save the parent or guardian details', () => {
  log('step', 'Save parent or guardian details');
  flow().saveParentGuardianDetails();
});

/**
 * @step Saves edits on the Company details form.
 */
When('I save the company details', () => {
  log('step', 'Save company details');
  flow().saveCompanyDetails();
});

/**
 * @step Attempts to cancel editing and chooses Cancel on the confirmation dialog.
 * Expected result: remain on the edit page.
 */
When('I attempt to cancel editing and choose Cancel on the confirmation dialog', () => {
  log('step', 'Cancel edit and choose Stay');
  flow().cancelEditAndStay();
});

/**
 * @step Verifies that the First name field still contains a given value after cancelling.
 *
 * @param expected - The expected First name value.
 */
Then('I should see the First name field still contains {string}', (expected: string) => {
  log('assert', 'First name should still contain', { expected });
  editDefendantDetails().assertFirstNameValue(expected);
});

/**
 * @step Attempts to cancel editing and chooses “OK” (confirm leave).
 * Expected result: navigate back to the account details page.
 */
When('I attempt to cancel editing and choose OK on the confirmation dialog', () => {
  log('step', 'Cancel edit and leave');
  commonFlow().cancelEditAndLeave();
});

/**
 * @step Ensures we remain on the edit page after cancelling (no navigation occurred).
 */
Then('I should remain on the defendant edit page', () => {
  log('assert', 'Remain on defendant edit page');
  editDefendantDetails().assertStillOnEditPage();
});

/**
 * @step Cancels a company edit and stays on the form.
 */
When('I cancel the company edit and choose to stay', () => {
  log('step', 'Cancel company edit and stay on form');
  flow().cancelCompanyEditAndStay();
});

/**
 * @step Cancels a company edit, confirms leaving, and expects the header to match.
 *
 * @param expectedHeader - Header text expected after discarding changes.
 */
When('I discard the company edit changes and expect the header {string}', (expectedHeader: string) => {
  const headerWithUniq = applyUniqPlaceholder(expectedHeader);
  log('step', 'Discard company edits', { expectedHeader: headerWithUniq });
  flow().discardCompanyEditAndReturn(headerWithUniq);
});

/**
 * @step Ensures the company edit form remains visible.
 */
Then('I should remain on the company edit page', () => {
  log('assert', 'Remain on company edit page');
  editCompanyDetails().assertStillOnEditPage();
});

/**
 * @step Asserts the company name field still contains the expected value.
 *
 * @param expected - Company name expected in the edit field.
 */
Then('I should see the company name field contains {string}', (expected: string) => {
  log('assert', 'Company name field contains', { expected });
  editCompanyDetails().verifyFieldValue(expected);
});

/**
 * @step Confirms the user has returned to the account details page defendant tab
 */
Then('I should return to the account details page Defendant tab', () => {
  log('assert', 'Return to Defendant details tab');
  navActions().assertDefendantTabIsActive();
});

Then('I should return to the account details page Parent or guardian tab', () => {
  log('assert', 'Return to Parent/Guardian details tab');
  navActions().assertParentGuardianTabIsActive();
});

/**
 * @step Asserts the defendant name displayed on the account summary contains the expected value.
 *
 * @param expected - Text expected within the defendant name.
 */
Then('I should see the defendant name contains {string}', (expected: string) => {
  log('assert', 'Defendant name contains', { expected });
  flow().assertDefendantNameContains(expected);
});

/**
 * @step Asserts the parent/guardian name displayed on the account summary contains the expected value.
 *
 * @param expected - Text expected within the parent/guardian name.
 */
Then('I should see the parent or guardian name contains {string}', (expected: string) => {
  log('assert', 'Parent or guardian name contains', { expected });
  flow().assertParentGuardianNameContains(expected);
});

/**
 * @step Asserts the company name displayed on the account summary contains the expected value.
 *
 * @param expected - Text expected within the company name.
 */
Then('I should see the company name contains {string}', (expected: string) => {
  const expectedWithUniq = applyUniqPlaceholder(expected);
  log('assert', 'Company name contains', { expected: expectedWithUniq });
  flow().assertCompanyNameContains(expectedWithUniq);
});

/**
 * @step Establishes an amendment baseline for defendant updates.
 *
 * @param updatedFirstName - First name to persist and audit.
 */
When('I establish a defendant amendment baseline with first name {string}', (updatedFirstName: string) => {
  log('step', 'Establish defendant amendment baseline', { updatedFirstName });
  flow().establishDefendantAmendmentBaseline(updatedFirstName);
});

/**
 * @step Establishes an amendment baseline for company updates.
 *
 * @param updatedCompanyName - Company name to persist and audit.
 */
When('I establish a company amendment baseline with company name {string}', (updatedCompanyName: string) => {
  const companyWithUniq = applyUniqPlaceholder(updatedCompanyName);
  log('step', 'Establish company amendment baseline', { updatedCompanyName: companyWithUniq });
  flow().establishCompanyAmendmentBaseline(companyWithUniq);
});

/**
 * @step Establishes an amendment baseline for parent/guardian updates.
 *
 * @param updatedFirstName - Guardian first name to persist and audit.
 */
When('I establish a parent or guardian amendment baseline with first name {string}', (updatedFirstName: string) => {
  log('step', 'Establish parent/guardian amendment baseline', { updatedFirstName });
  flow().establishParentGuardianAmendmentBaseline(updatedFirstName);
});

/**
 * @step Verifies via API that a defendant amendment exists for the provided first name.
 *
 * @param expectedForename - First name expected in the amendment record.
 */
Then('I verify defendant amendments via API for first name {string}', (expectedForename: string) => {
  log('step', 'Verify defendant amendments via API', { expectedForename });
  flow().verifyDefendantAmendmentsViaApi(expectedForename);
});

/**
 * @step Verifies via API that a company amendment exists for the provided company name.
 *
 * @param expectedCompanyName - Company name expected in the amendment record.
 */
Then('I verify Company amendments via API for company name {string}', (expectedCompanyName: string) => {
  const companyWithUniq = applyUniqPlaceholder(expectedCompanyName);
  log('assert', 'Verify company amendments via API', { expectedCompanyName: companyWithUniq });
  flow().verifyCompanyAmendmentsViaApi(companyWithUniq);
});

/**
 * @step Verifies via API that a parent/guardian amendment exists for the provided guardian name.
 *
 * @param expectedGuardianName - Guardian name expected in the amendment record.
 */
Then('I verify parent or guardian amendments via API for guardian name {string}', (expectedGuardianName: string) => {
  log('assert', 'Verify parent/guardian amendments via API', { expectedGuardianName });
  flow().verifyParentGuardianAmendmentsViaApi(expectedGuardianName);
});

/**
 * @step Verifies via API that no defendant amendments were created.
 */
Then('I verify no amendments were created via API', () => {
  log('assert', 'Verify no amendments were created via API');
  flow().verifyNoDefendantAmendments();
});

/**
 * @step Verifies via API that no company amendments were created.
 */
Then('I verify no amendments were created via API for company details', () => {
  log('assert', 'Verify no amendments were created via API for company details');
  flow().verifyNoCompanyAmendments();
});

/**
 * @step Verifies via API that no parent/guardian amendments were created.
 */
Then('I verify no amendments were created via API for parent or guardian details', () => {
  log('assert', 'Verify no amendments were created via API for parent or guardian details');
  flow().verifyNoParentGuardianAmendments();
});

/**
 * @step Searches for an account by company name.
 *
 * @param companyName - Company name to search by.
 */
When('I search for the account by company name {string}', (companyName: string) => {
  const companyWithUniq = applyUniqPlaceholder(companyName);
  log('step', 'Search by company name', { companyName: companyWithUniq });
  flow().searchByCompanyName(companyWithUniq);
});

/**
 * @step Opens a company account details page by company name.
 *
 * @param companyName - The visible company name to locate and open.
 */
When('I open the company account details for {string}', (companyName: string) => {
  const companyWithUniq = applyUniqPlaceholder(companyName);
  log('step', 'Open company account details', { companyName: companyWithUniq });
  flow().openCompanyAccountDetailsByNameAndSelectLatest(companyWithUniq);
});

/**
 * @step Opens the Add account note screen and verifies that the header text is correct.
 *
 * @example
 * When I open the Add account note screen and verify the header is Add account note
 */
When('I open the Add account note screen and verify the header is Add account note', () => {
  log('step', 'Open Add account note screen');
  cy.location('pathname', common().getTimeoutOptions()).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
  flow().openAddAccountNoteAndVerifyHeader();
});

/**
 * @step Enters text into the notes field and saves it.
 *
 * @param note - The note text to input and save.
 * @example
 * When I enter "This is a test note" into the notes field and save the note
 */
When('I enter {string} into the notes field and save the note', (note: string) => {
  log('step', 'Enter and save note', { note });
  flow().enterAndSaveNote(note);
});

/**
 * @step Opens Add account note, saves the provided text, and confirms return to details.
 *
 * @param noteText - The note text to record.
 * @example
 * When I record an account note "Valid test account note"
 */
When('I record an account note {string}', (noteText: string) => {
  log('step', 'Record account note and return to details', { noteText });
  flow().openAccountNoteEnterNoteAndSave(noteText);
});

/**
 * @step Starts Add account note and cancels without entering data.
 *
 * @example
 * When I start an account note and cancel without saving
 */
When('I start an account note and cancel without saving', () => {
  log('step', 'Start account note then cancel without input');
  flow().cancelAccountNoteWithoutEntering();
});

/**
 * @step Opens Add account note, enters text, and cancels (discarding changes).
 *
 * @param noteText - The note text to input before cancelling.
 * @example
 * When I start an account note with "This is a test account note for validation" and cancel
 */
When('I start an account note with {string} and cancel', (noteText: string) => {
  log('step', 'Start account note, enter text, cancel', { noteText });
  flow().openNotesScreenEnterTextAndCancel(noteText);
});

/**
 * @step Saves comments and verifies we returned to the correct account page header.
 *
 * @example
 *   When I save the following comments and verify the account header is "Mr John ACCDETAILSURNAME":
 *     | field   | text         |
 *     | comment | Comment Test |
 *     | Line 1  | Line1 Test   |
 *     | Line 2  | Line2 Test   |
 *     | Line 3  | Line3 Test   |
 */
When(
  'I save the following comments and verify the account header is {string}:',
  (expectedHeader: string, table: DataTable) => {
    const headerWithUniq = applyUniqPlaceholder(expectedHeader);
    const rows = (table.hashes?.() ?? []) as CommentRow[];
    const texts = rows.map((r) => (r['text'] ?? '').trim()).filter((t) => t.length > 0);

    log('step', 'Save comments and verify header', { expectedHeader: headerWithUniq });
    flow().saveCommentsReturnAndAssertHeader(texts, headerWithUniq);
  },
);

/**
 * @step Opens the Add account note screen, enters text, and navigates back,
 * confirming the unsaved changes warning.
 *
 * @param noteText - The note text to input before navigating back.
 * @example
 * When I start an account note with "This is a test account note for back button" and confirm browser back
 */
When('I start an account note with {string} and confirm browser back', (noteText: string) => {
  log('step', 'Start account note, enter text, confirm back navigation', { noteText });
  flow().openScreenEnterTextAndNavigateBackWithConfirmation(noteText);
});

/**
 * @step Opens Comments from the defendant summary and validates the page.
 */
When('I open the Comments page from the defendant summary and verify the page contents', () => {
  log('step', 'Open Comments from summary');
  flow().openCommentsFromSummaryAndVerifyPageDetails();
});

/**
 * @step Cancels on the Comments page and confirms leaving, returning to the summary.
 */
When('I cancel with confirmation on the Comments page', () => {
  log('step', 'Cancel Comments and confirm leave');

  // Click Cancel and confirm the unsaved-changes dialog
  // comments().clickCancelLink();
  common().cancelEditing(true);

  // Optional defensive check: ensure the Comments page has closed before the summary assertion runs
  cy.location('pathname', common().getTimeoutOptions()).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
});

/**
 * @step Verifies route guard behaviour on the Comments page:
 *  - opens Comments from summary,
 *  - enters unsaved text,
 *  - cancels without confirmation (remains on Comments and text retained),
 *  - cancels with confirmation (returns to summary) and verifies the header.
 *
 * @example
 *   And I verify route guard behaviour when cancelling comments with "Comment Test"
 */
When('I verify route guard behaviour when cancelling comments with {string}', (noteText: string) => {
  log('step', 'Verify Comments route guard', { noteText });
  flow().verifyRouteGuardBehaviourOnComments(noteText);
});

/**
 * @step Verify updated comments display in Comments section.
 *
 * @example
 * Then Verify updated comments display in Comments section:
 *   | Comment | Comment Test |
 *   | Line 1  | Line1 Test   |
 *   | Line 2  | Line2 Test   |
 *   | Line 3  | Line3 Test   |
 */
Then('Verify updated comments display in Comments section:', (table: DataTable) => {
  const hash = table.rowsHash?.() ?? {};
  const comment = (hash['Comment'] ?? '').trim();
  const lines = ['Line 1', 'Line 2', 'Line 3'].map((k) => (hash[k] ?? '').trim()).filter((v) => v.length > 0);

  log('assert', 'Verify comments display', { comment, lines });
  atAGlanceDetails().assertCommentsSection({ comment, lines });
});

/**
 * @step Assert Comments form is prefilled with the values from the data table.
 * The flow encapsulates opening Comments + field assertions.
 */
Then('I should see the following values on the Comments form:', (table: DataTable) => {
  const hash = rowsHashSafe(table);
  const expected = {
    comment: hash['Comment'],
    line1: hash['Line 1'],
    line2: hash['Line 2'],
    line3: hash['Line 3'],
  } as const;

  log('assert', 'Verify Comments form prefill', expected);
  flow().verifyPrefilledComments(expected);
});

/**
 * @step Validates route-guard behaviour for parent guardian edits.
 * It temporarily edits the first name, cancels once, verifies persistence,
 * then cancels again to revert to the original.
 */
When('I verify route guard behaviour when cancelling Parent or guardian edits', () => {
  log('step', 'Verify Parent/Guardian route guard');
  flow().verifyParentGuardianRouteGuardBehaviour('Miss Catherine GREEN', 'FNAMECHANGE');
});

/**
 * @step Initiates Parent/Guardian edit and cancels without saving (AC3).
 * Thin step → delegates to a single flow.
 */
When('I edit Parent or guardian details but cancel without saving', () => {
  log('step', 'Edit Parent/Guardian → cancel without saving');
  flow().cancelParentGuardianEditWithoutSaving();
});

/**
 * @step Partially edits Parent/Guardian details and chooses to stay on the page.
 * Covers the route-guard "Cancel → Stay" path where the temporary value persists.
 */
When('I partially edit Parent or guardian details and choose to stay on the page', () => {
  log('step', 'Partially edit Parent/Guardian → stay on page');
  flow().cancelParentGuardianEditButStayOnPage();
});

/**
 * @step Verifies the unsaved temporary value remains after Cancel → Stay.
 */
Then('I should see the unsaved value retained for Last name as {string}', (expected: string) => {
  log('assert', 'Verify unsaved PG last name retained', { expected });
  editParentGuardianDetails().verifyLastName(expected);
});
