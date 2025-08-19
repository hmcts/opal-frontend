import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form/fines-acc-note-add-form';
import { IFinesAccAddNoteForm } from './interfaces/fines-acc-note-add-form.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';

@Component({
  selector: 'app-acc-note-add',
  imports: [FinesAccNoteAddFormComponent],
  templateUrl: './fines-acc-note-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNoteAddComponent extends AbstractFormParentBaseComponent {
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly finesAccStore = inject(FinesAccountStore);

  private buildAddNotePayload(form: IFinesAccAddNoteForm): IOpalFinesAddNotePayload {
    //mock construct the payload for adding a note
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
    //mock api call to add a note
    this.opalFinesService.postAddNotePayload(this.buildAddNotePayload(form)).subscribe({
      next: (res) => {
        console.log('note created:', res);
        this.routerNavigate(this.finesAccRoutingPaths.children.details);
      },
      error: (err) => console.error('failed to add note', err),
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
