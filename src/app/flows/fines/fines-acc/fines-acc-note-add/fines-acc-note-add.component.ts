import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form/fines-acc-note-add-form';
import { IFinesAccAddNoteForm } from './interfaces/fines-acc-note-add-form.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { FinesAccStore } from '../store/fines-acc-store';
@Component({
  selector: 'app-acc-note-add',
  imports: [FinesAccNoteAddFormComponent],
  templateUrl: './fines-acc-note-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNoteAddComponent extends AbstractFormParentBaseComponent {
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  FINES_ACC_STORE = inject(FinesAccStore);
  /**
   * Handles the form submission for adding a note.
   * @param addNoteForm - The form data containing the note details.
   */
  public handleAddNoteSubmit(form: IFinesAccAddNoteForm): void {
    console.log('form submitted:', form);
    console.log(this.FINES_ACC_STORE.accountData());
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    console.log('unsaved changes:', unsavedChanges);
  }
}
