import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { FinesConfAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form/fines-conf-account-comments-notes-form.component';
import { FinesConfiscationStore } from '../stores/fines-confiscation.store';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { IFinesConfAccountCommentsNotesForm } from './interfaces/fines-conf-account-comments-notes-form.interface';

@Component({
  selector: 'app-fines-conf-account-comments-notes',
  imports: [FinesConfAccountCommentsNotesFormComponent],
  templateUrl: './fines-conf-account-comments-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConfAccountCommentsNotesComponent extends AbstractFormParentBaseComponent {
  private readonly finesConfiscationStore = inject(FinesConfiscationStore);

  /**
   * Handles the submission of the account comments and notes form.
   *
   * @param form - The form data for the account comments and notes.
   * @returns void
   */
  public handleAccountCommentsNoteSubmit(form: IFinesConfAccountCommentsNotesForm): void {
    this.finesConfiscationStore.setAccountCommentsNotes(form);
    this.routerNavigate(PAGES_ROUTING_PATHS.children.dashboard);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleUnsavedChanges(unsavedChanges: any): void {
    this.finesConfiscationStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
