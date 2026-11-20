import { AprManagementActions } from '../actions/account-enquiry/apr-management.actions';
import { AccountEnquiryFlow } from './account-enquiry.flow';

export class AprManagementFlow {
  private readonly accounts = new AccountEnquiryFlow();
  private readonly apr = new AprManagementActions();

  public openForDefendant(surname: string): void {
    this.accounts.openDefendantPaymentTermsTabBySurname(surname);
    this.apr.openFromPaymentTerms();
  }

  public addReference(reference: string): void {
    this.apr.startAddingReference();
    this.apr.saveReference(reference);
  }

  public attemptDuplicateCreation(reference: string): void {
    this.apr.watchReferenceCreation();
    this.addReference(reference);
  }

  public changeReference(current: string, replacement: string): void {
    this.apr.startChangingReference(current);
    this.apr.saveReference(replacement);
  }

  public attemptDuplicateUpdate(current: string, replacement: string): void {
    this.apr.startChangingReference(current);
    this.apr.attemptDuplicateUpdate(replacement);
  }
}
