import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_MAC_NESTED_ROUTE_KEYS } from '../constants/fines-mac-nested-route-keys.constant';
import { FinesMacFormParentBaseComponent } from '../components/abstract/fines-mac-form-parent-base/fines-mac-form-parent-base.component';
import { IFinesMacAccountCommentsNotesForm } from './interfaces/fines-mac-account-comments-notes-form.interface';
import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form/fines-mac-account-comments-notes-form.component';

@Component({
  selector: 'app-fines-mac-account-comments-notes',
  imports: [FinesMacAccountCommentsNotesFormComponent],
  templateUrl: './fines-mac-account-comments-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the submission of the account comments and notes form.
   *
   * @param form - The form data for the account comments and notes.
   * @returns void
   */
  public handleAccountCommentsNoteSubmit(form: IFinesMacAccountCommentsNotesForm): void {
    // Add system-generated note if applicable
    form.formData.fm_account_comments_notes_system_notes =
      this.finesMacStore.accountCommentsNotes().formData.fm_account_comments_notes_system_notes;
    this.finesMacStore.setAccountCommentsNotes(form);

    if (form.nestedFlow) {
      this.handleNestedFlowNavigation(FINES_MAC_NESTED_ROUTE_KEYS.accountCommentsNotes);
      return;
    }

    this.navigateToAccountDetails();
  }
}
