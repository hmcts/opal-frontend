import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCashInputFlow } from '../../e2e/functional/opal/flows/manual-cash-input.flow';

const manualCashInputFlow = () => new ManualCashInputFlow();

When('I open Manual Cash Input', () => {
  manualCashInputFlow().openCreateAndAllocate();
});

When('I open Manual Cash Input with outstanding tills', () => {
  manualCashInputFlow().openCreateAndAllocateWithOutstandingTills();
});

When('I select a till and decline the Manual Cash Input leave-page warning', () => {
  manualCashInputFlow().selectTillAndDeclineBackNavigation();
});

When('I select a till and accept the Manual Cash Input leave-page warning', () => {
  manualCashInputFlow().selectTillAndAcceptBackNavigation();
});

When('I create a till', () => {
  manualCashInputFlow().startCreateTill();
});

When('I create a till with one unit', () => {
  manualCashInputFlow().startCreateTillWithOneBusinessUnit();
});

Then('the Manual Cash Input business units are listed alphabetically', () => {
  manualCashInputFlow().assertBusinessUnitsAreAlphabetical();
});

When('I select {string}', (businessUnit: string) => {
  manualCashInputFlow().selectBusinessUnit(businessUnit);
});

When('I continue', () => {
  manualCashInputFlow().continueWithSelectedBusinessUnit();
});

When('I continue without a selection', () => {
  manualCashInputFlow().continueWithoutBusinessUnit();
});

When('I continue with the read-only unit', () => {
  manualCashInputFlow().continueWithReadOnlyBusinessUnit();
});

Then('I see empty Till Details for {string}', (businessUnit: string) => {
  manualCashInputFlow().assertEmptyTillDetails(businessUnit);
});

When('I add a payment to the till', () => {
  manualCashInputFlow().addPayment();
});

When('I continue with payment category {string}', (category: 'criminal' | 'courtFee' | 'suspense') => {
  manualCashInputFlow().continueWithPaymentCategory(category);
});

Then('I see Search for an Account', () => {
  manualCashInputFlow().assertSearchForAccountIsDisplayed();
});

Then('the selected business unit is displayed on Search for an Account', () => {
  manualCashInputFlow().assertSearchForAccountBusinessUnitIsDisplayed();
});

Then('the Search for an Account screen displays the quick and advanced search fields', () => {
  manualCashInputFlow().assertSearchForAccountFieldsAreDisplayed();
});

Then('I see Court Fee Details', () => {
  manualCashInputFlow().assertPaymentCategoryDetailsAreDisplayed('courtFee');
});

When('I submit a CF001 court fee payment of {string} for {string} items', (amount: string, numberOfItems: string) => {
  manualCashInputFlow().submitCourtFeePayment(amount, numberOfItems);
});

Then('I see Court Fee Payment Details', () => {
  manualCashInputFlow().assertCourtFeePaymentDetailsIsDisplayed();
});

Then('I see Court Fee Overpayment\\/Underpayment Confirmation', () => {
  manualCashInputFlow().assertCourtFeeOverUnderpaymentIsDisplayed();
});

Then('the confirmation identifies the payment as an {string}', (type: 'overpayment' | 'underpayment') => {
  manualCashInputFlow().assertCourtFeePaymentTypeIsDisplayed(type);
});

Then(
  'the {string} confirmation banner shows a {string} {word}',
  (banner: 'information' | 'warning', amount: string, type: 'overpayment' | 'underpayment') => {
    manualCashInputFlow().assertCourtFeeDifferenceBannerIsDisplayed(banner, amount, type);
  },
);

Then(
  'the confirmation shows court fee {string}, amount {string}, and {string} items',
  (courtFee: string, amount: string, numberOfItems: string) => {
    manualCashInputFlow().assertCourtFeePaymentSummaryIsDisplayed(courtFee, amount, numberOfItems);
  },
);

Then('the overpayment confirmation offers Confirm and Cancel', () => {
  manualCashInputFlow().assertOverpaymentConfirmationActionsAreDisplayed();
});

When('I confirm the overpayment', () => {
  manualCashInputFlow().confirmOverpayment();
});

When('I cancel the overpayment', () => {
  manualCashInputFlow().cancelOverpayment();
});

Then('the underpayment confirmation offers Cancel and return to till and Go back', () => {
  manualCashInputFlow().assertUnderpaymentConfirmationActionsAreDisplayed();
});

When('I cancel the underpayment and return to the till', () => {
  manualCashInputFlow().cancelUnderpaymentAndReturnToTill();
});

When('I go back from the Court Fee confirmation', () => {
  manualCashInputFlow().goBackFromCourtFeeConfirmation();
});

Then('the Court Fee Details form is blank', () => {
  manualCashInputFlow().assertCourtFeeDetailsFormIsBlank();
});

Then('I see Suspense Details', () => {
  manualCashInputFlow().assertPaymentCategoryDetailsAreDisplayed('suspense');
});

When('I submit an unidentified credit transfer suspense payment', () => {
  manualCashInputFlow().submitUnidentifiedCreditTransferSuspensePayment();
});

Then('I see Check Suspense Payment', () => {
  manualCashInputFlow().assertCheckSuspensePaymentIsDisplayed();
});

Then(
  'a suspense note is required before I can {string}',
  (saveAction: 'save and review till' | 'save and add another payment') => {
    manualCashInputFlow().assertSuspenseNoteIsRequired(
      saveAction === 'save and review till' ? 'reviewTill' : 'addAnother',
    );
  },
);

Then('a whitespace-only suspense note is rejected', () => {
  manualCashInputFlow().assertWhitespaceSuspenseNoteIsRejected();
});

When('I save the suspense payment and review the till', () => {
  manualCashInputFlow().saveSuspensePaymentAndReviewTill();
});

When('I save the suspense payment and add another payment', () => {
  manualCashInputFlow().saveSuspensePaymentAndAddAnotherPayment();
});

When('I change the saved suspense payment', () => {
  manualCashInputFlow().changeSavedSuspensePayment();
});

When('I update the saved suspense payment', () => {
  manualCashInputFlow().updateSavedSuspensePayment();
});

When('I change the suspense payment details', () => {
  manualCashInputFlow().changeSuspensePaymentDetails();
});

When('I follow the Change link for payment detail {string}', (changeLabel: string) => {
  manualCashInputFlow().openPaymentDetailChangeLink(changeLabel);
});

When('I change the credit-transfer source to {string}', (source: string) => {
  manualCashInputFlow().changeCreditTransferSource(source);
});

When(
  'I change the payment method to {string} displayed as {string} with reference {string}',
  (method: string, methodLabel: string, reference: string) => {
    manualCashInputFlow().changeSuspensePaymentMethod(method, methodLabel, reference);
  },
);

When('I amend the suspense payment with identified payer details', () => {
  manualCashInputFlow().amendSuspensePaymentWithPayerDetails();
});

When(
  'I amend the suspense payment with reason {string} displayed as {string}',
  (reason: string, reasonLabel: string) => {
    manualCashInputFlow().amendSuspensePaymentWithReason(reason, reasonLabel);
  },
);

When('I change the suspense payer details', () => {
  manualCashInputFlow().changeSuspensePayerDetails();
});

When('I follow the Change link for payer detail {string}', (changeLabel: string) => {
  manualCashInputFlow().openPayerDetailChangeLink(changeLabel);
});

When('I cancel the suspense payment and {string} the leave-page warning', (response: 'accept' | 'decline') => {
  manualCashInputFlow().cancelSuspensePayment(response === 'accept');
});

When('I save a suspense payment with a 1000-character note', () => {
  manualCashInputFlow().saveMaximumLengthSuspenseNote();
});

Then('I remain on Payment Category', () => {
  manualCashInputFlow().assertPaymentCategoryIsDisplayed();
});

When('I continue without selecting a payment category', () => {
  manualCashInputFlow().continueWithoutPaymentCategory();
});

Then('the payment category validation summary and field error are displayed', () => {
  manualCashInputFlow().assertPaymentCategoryValidation();
});

When('I cancel Payment Category', () => {
  manualCashInputFlow().cancelPaymentCategory();
});

When('I delete the till being created', () => {
  manualCashInputFlow().deleteTill();
});

When('I cancel', () => {
  manualCashInputFlow().cancelWithoutBusinessUnit();
});

When('I cancel with a unit', () => {
  manualCashInputFlow().selectBusinessUnitAndDeclineCancel();
});

When('I accept the warning', () => {
  manualCashInputFlow().acceptCancelAfterBusinessUnitSelection();
});

Then('I remain on Manual Cash Input with the till selected', () => {
  manualCashInputFlow().assertSelectionIsRetained();
});

Then('I return to the Finance landing page', () => {
  manualCashInputFlow().assertFinanceLandingPageIsDisplayed();
});

When('I sort Manual Cash Input tills and refresh the page', () => {
  manualCashInputFlow().sortTillsAndRefresh();
});

Then('Manual Cash Input till sorting is reset', () => {
  manualCashInputFlow().assertTillSortingIsReset();
});
