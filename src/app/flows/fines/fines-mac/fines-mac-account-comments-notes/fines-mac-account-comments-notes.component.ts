import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacAccountCommentsNotesForm } from './interfaces/fines-mac-account-comments-notes-form.interface';
import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form/fines-mac-account-comments-notes-form.component';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';

@Component({
  selector: 'app-fines-mac-account-comments-notes',

  imports: [FinesMacAccountCommentsNotesFormComponent],
  templateUrl: './fines-mac-account-comments-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type!;

  /**
   * Handles the submission of the account comments and notes form.
   *
   * @param form - The form data for the account comments and notes.
   * @returns void
   */
  public handleAccountCommentsNoteSubmit(form: IFinesMacAccountCommentsNotesForm): void {
    // Update the status based on whether data has been provided or not
    form.status = this.hasFormValues(form.formData) ? FINES_MAC_STATUS.PROVIDED : FINES_MAC_STATUS.NOT_PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      accountCommentsNotes: form,
      unsavedChanges: false,
      stateChanges: true,
    };

    // Navigate to the next route
    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType]['accountCommentsNotes'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
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
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
