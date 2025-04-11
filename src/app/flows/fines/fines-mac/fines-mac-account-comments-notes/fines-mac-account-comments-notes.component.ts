import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacAccountCommentsNotesForm } from './interfaces/fines-mac-account-comments-notes-form.interface';
import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form/fines-mac-account-comments-notes-form.component';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-account-comments-notes',
  imports: [FinesMacAccountCommentsNotesFormComponent],
  templateUrl: './fines-mac-account-comments-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountCommentsNotesComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Handles the submission of the account comments and notes form.
   *
   * @param form - The form data for the account comments and notes.
   * @returns void
   */
  public handleAccountCommentsNoteSubmit(form: IFinesMacAccountCommentsNotesForm): void {
    this.finesMacStore.setAccountCommentsNotes(form);

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
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
