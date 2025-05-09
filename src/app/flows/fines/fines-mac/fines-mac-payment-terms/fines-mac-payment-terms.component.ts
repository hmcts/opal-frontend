import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacPaymentTermsForm } from './interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form/fines-mac-payment-terms-form.component';
import { FinesMacStore } from '../stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import {
  FINES_MAC_PAYMENT_TERMS_SYSTEM_GENERATED_NOTES_COLLECTION_ORDER_MADE,
  FINES_MAC_PAYMENT_TERMS_SYSTEM_GENERATED_NOTES_COLLECTION_ORDER_MADE_TODAY,
} from './constants/fines-mac-payment-terms-system-generated-notes.constant';

@Component({
  selector: 'app-fines-mac-payment-terms',
  imports: [FinesMacPaymentTermsFormComponent],
  templateUrl: './fines-mac-payment-terms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly globalStore = inject(GlobalStore);
  private readonly userState = this.globalStore.userState();
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Generates a system note based on the collection order status and date.
   *
   * @param collectionOrderDate - The date when the collection order was made, or null if not applicable.
   * @param collectionOrder - A boolean indicating whether a collection order was previously made.
   * @returns A string containing the generated note, or null if no collection order date is provided.
   */
  private systemGenerateNote(collectionOrderDate: string | null, collectionOrder: boolean): string | null {
    if (!collectionOrderDate) return null;

    return collectionOrder
      ? FINES_MAC_PAYMENT_TERMS_SYSTEM_GENERATED_NOTES_COLLECTION_ORDER_MADE.replace(
          '{collectionOrderDate}',
          collectionOrderDate,
        )
      : FINES_MAC_PAYMENT_TERMS_SYSTEM_GENERATED_NOTES_COLLECTION_ORDER_MADE_TODAY.replace(
          '{user}',
          this.userState.name,
        );
  }

  /**
   * Adds a system-generated note to the account comments notes data in the finesMacStore.
   *
   * @param collectionOrderDate - The date of the collection order, or `null` if not applicable.
   * @param collectionOrderMade - A boolean indicating whether the collection order was made.
   *
   * This method clones the existing account comments notes data and updates it with a
   * system-generated note based on the provided `collectionOrderDate` and `collectionOrderMade` values.
   * The updated data is then set in the finesMacStore.
   */
  private addSystemGeneratedNote(collectionOrderDate: string | null, collectionOrderMade: boolean): void {
    const accountCommentsNotesData = {
      ...structuredClone(this.finesMacStore.accountCommentsNotes()),
      formData: {
        ...structuredClone(this.finesMacStore.accountCommentsNotes().formData),
        fm_account_comments_notes_system_notes: this.systemGenerateNote(collectionOrderDate, collectionOrderMade),
      },
    };

    this.finesMacStore.setAccountCommentsNotes(accountCommentsNotesData);
  }

  /**
   * Handles the submission of the payment terms form.
   * Updates the finesMacStore with the new payment terms and sets unsavedChanges and stateChanges flags.
   * Navigates to the appropriate route based on whether it's a nested flow or not.
   *
   * @param form - The payment terms form data.
   */
  public handlePaymentTermsSubmit(form: IFinesMacPaymentTermsForm): void {
    // Change number fields to number type
    const {
      fm_payment_terms_lump_sum_amount,
      fm_payment_terms_instalment_amount,
      fm_payment_terms_default_days_in_jail,
    } = form.formData;
    form.formData.fm_payment_terms_lump_sum_amount = fm_payment_terms_lump_sum_amount
      ? Number(fm_payment_terms_lump_sum_amount)
      : null;
    form.formData.fm_payment_terms_instalment_amount = fm_payment_terms_instalment_amount
      ? Number(fm_payment_terms_instalment_amount)
      : null;
    form.formData.fm_payment_terms_default_days_in_jail = fm_payment_terms_default_days_in_jail
      ? Number(fm_payment_terms_default_days_in_jail)
      : null;

    this.finesMacStore.setPaymentTerms(form);

    const { fm_payment_terms_collection_order_date, fm_payment_terms_collection_order_made } = form.formData;
    this.addSystemGeneratedNote(fm_payment_terms_collection_order_date, !!fm_payment_terms_collection_order_made);

    if (form.nestedFlow) {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes);
    } else {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
