import { ManualCashInputActions } from '../actions/manual-cash-input.actions';
import { ManualCashInputPayerActions } from '../actions/manual-cash-input-payer.actions';

/** Composes real Manual Cash Input journeys without directly seeding application stores. */
export class ManualCashInputPayerFlow {
  private readonly cashInput = new ManualCashInputActions();
  private readonly payer = new ManualCashInputPayerActions();

  /**
   * Sets the payer field used in a validation journey.
   * @param field - Payer form field identifier.
   * @param value - Value to enter in the field.
   */
  public setField(field: string, value: string): void {
    this.payer.setField(field, value);
  }

  /**
   * Verifies the payer cannot continue until the field is corrected.
   * @param field - Payer form field identifier.
   * @param message - Expected validation message.
   */
  public assertFieldError(field: string, message: string): void {
    this.payer.assertFieldError(field, message);
  }

  /** Adds a suspense payment through the existing till journey.
   * @param reason - Suspense reason selected on the payment form.
   */
  public recordSuspense(reason: string): void {
    this.cashInput.addPayment();
    this.cashInput.continueWithPaymentCategory('suspense');
    this.payer.submitSuspense(reason);
  }

  /** Verifies arrival at Payer Details with the selected business unit. */
  public assertBusinessUnit(): void {
    this.payer.assertBusinessUnit();
  }

  /** Verifies the payer form is ready for interaction or accessibility checks. */
  public assertPayerPage(): void {
    this.payer.assertPayerPage();
  }
  /** Captures payer details for the current suspense payment.
   * @param type - Individual or company payer type.
   * @param details - Whether to populate full or minimal payer details.
   */
  public enterPayer(type: string, details: string): void {
    this.payer.enterPayer(type, details);
  }
  /** Chooses a payer type for the conditional form.
   * @param type - Individual or company payer type.
   */
  public selectType(type: string): void {
    this.payer.selectType(type);
  }
  /** Continues from Payer Details. */
  public submitPayer(): void {
    this.payer.submitPayer();
  }
  /** Verifies arrival at the temporary check-payment destination. */
  public assertCheckPayment(): void {
    this.payer.assertCheckPayment();
  }
  /** Requests page navigation with the specified warning response.
   * @param action - Back or Cancel page action.
   * @param response - Whether to confirm, decline, or expect no warning.
   */
  public leavePayer(action: string, response: string): void {
    this.payer.leavePayer(action, response);
  }
  /** Verifies that declining navigation retains the payer details.
   * @param type - Individual or company payer type.
   */
  public assertPayerRetained(type: string): void {
    this.payer.assertPayerRetained(type);
  }
  /** Checks the destination after leaving the payer form.
   * @param action - Back or Cancel page action.
   */
  public assertLeaveDestination(action: string): void {
    this.payer.assertLeaveDestination(action);
  }
  /** Verifies required payer-type validation. */
  public assertPayerTypeRequired(): void {
    this.payer.assertPayerTypeRequired();
  }

  /** Reopens the discarded journey and verifies cleared fields through the UI.
   * @param action - Back or Cancel page action.
   */
  public assertDiscardedPayerDoesNotReturn(action: string): void {
    if (action === 'Cancel') {
      this.cashInput.assertEmptyTillDetails('Camden and Islington');
      this.cashInput.addPayment();
      this.cashInput.continueWithPaymentCategory('suspense');
      this.payer.assertSuspenseBlank();
      this.payer.submitSuspense('overpayment');
    } else {
      this.payer.continueFromSuspense();
    }
    this.payer.assertPayerBlank();
  }
}
