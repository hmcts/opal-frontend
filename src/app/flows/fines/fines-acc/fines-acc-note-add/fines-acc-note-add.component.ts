import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form/fines-acc-note-add-form.component';
import { IFinesAccAddNoteForm } from './interfaces/fines-acc-note-add-form.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-acc-note-add',
  imports: [FinesAccNoteAddFormComponent],
  templateUrl: './fines-acc-note-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNoteAddComponent extends AbstractFormParentBaseComponent {
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly utilsService = inject(UtilsService);
  protected readonly finesAccStore = inject(FinesAccountStore);

  /**
   * Constructs the payload for adding a note.
   *
   * This method collects necessary data from the finesAccStore as well as the form input to build the
   * payload required for adding a new note to the account. It gathers the account version, the associated
   * record's type and ID, the note type (hardcoded as 'AA'), and the note text from the form data.
   *
   * @param form - The form containing note data for the fines account.
   * @returns The payload object conforming to the IOpalFinesAddNotePayload interface.
   */
  private buildAddNotePayload(form: IFinesAccAddNoteForm): IOpalFinesAddNotePayload {
    // construct the payload for adding a note
    return {
      account_version: this.finesAccStore.version()!,
      associated_record_type: this.finesAccStore.party_type()!,
      associated_record_id: this.finesAccStore.party_id()!,
      note_type: 'AA',
      note_text: form.formData.facc_add_notes!,
    };
  }

  /**
   * Handles the form submission for adding a note.
   * @param addNoteForm - The form data containing the note details.
   */
  public handleAddNoteSubmit(form: IFinesAccAddNoteForm): void {
    // POST request api call to add a note
    this.opalFinesService.postAddNotePayload(this.buildAddNotePayload(form)).subscribe({
      next: () => {
        this.routerNavigate(this.finesAccRoutingPaths.children.details);
      },
      error: () => this.utilsService.scrollToTop(),
    });
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
