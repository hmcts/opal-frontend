import { AprManagementActions } from '../actions/account-enquiry/apr-management.actions';
import { AccountEnquiryFlow } from './account-enquiry.flow';

/** Composes account enquiry and APR actions into user journeys. */
export class AprManagementFlow {
  private readonly accounts = new AccountEnquiryFlow();
  private readonly apr = new AprManagementActions();

  /**
   * Finds the defendant, opens Payment terms and follows the APR Management link.
   * @param surname - Defendant surname used to find the account.
   */
  public openForDefendant(surname: string): void {
    this.accounts.openDefendantPaymentTermsTabBySurname(surname);
    this.apr.openFromPaymentTerms();
  }

  /**
   * Opens the add form and submits a reference.
   * @param reference - Reference value used in the scenario.
   */
  public addReference(reference: string): void {
    this.apr.startAddingReference();
    this.apr.saveReference(reference);
  }

  /**
   * Submits an existing reference value while observing the create request.
   * @param reference - Reference value used in the scenario.
   */
  public attemptDuplicateCreation(reference: string): void {
    this.apr.watchReferenceCreation();
    this.addReference(reference);
  }

  /**
   * Selects the current reference and submits its replacement.
   * @param current - Existing reference value.
   * @param replacement - Value submitted as the replacement.
   */
  public changeReference(current: string, replacement: string): void {
    this.apr.startChangingReference(current);
    this.apr.saveReference(replacement);
  }

  /**
   * Selects the current reference and attempts to replace it with an existing value.
   * @param current - Existing reference value.
   * @param replacement - Value submitted as the replacement.
   */
  public attemptDuplicateUpdate(current: string, replacement: string): void {
    this.apr.startChangingReference(current);
    this.apr.attemptDuplicateUpdate(replacement);
  }
}
