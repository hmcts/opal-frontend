import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { ConfiscationAccountCommentsNotesFormComponent } from './confiscation-account-comments-notes-form/confiscation-account-comments-notes-form.component';
import { ConfiscationStore } from '../stores/confiscation.store';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { IConfiscationAccountCommentsNotesForm } from './interfaces/confiscation-account-comments-notes-form.interface';

@Component({
  selector: 'app-confiscation-account-comments-notes',
  imports: [ConfiscationAccountCommentsNotesFormComponent],
  templateUrl: './confiscation-account-comments-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiscationAccountCommentsNotesComponent extends AbstractFormParentBaseComponent {
  private readonly confiscationStore = inject(ConfiscationStore);

  /**
   * Handles the submission of the account comments and notes form.
   *
   * @param form - The form data for the account comments and notes.
   * @returns void
   */
  public handleAccountCommentsNoteSubmit(form: IConfiscationAccountCommentsNotesForm): void {
    this.confiscationStore.setAccountCommentsNotes(form);
    this.routerNavigate(PAGES_ROUTING_PATHS.children.dashboard);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleUnsavedChanges(unsavedChanges: any): void {
    this.confiscationStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
