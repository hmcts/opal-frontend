import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form/fines-acc-note-add-form';
import { IFinesAccAddNoteForm } from './interfaces/fines-acc-note-add-form.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-acc-note-add',
  imports: [FinesAccNoteAddFormComponent],
  templateUrl: './fines-acc-note-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNoteAddComponent extends AbstractFormParentBaseComponent {
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly opalFinesService = inject(OpalFines);

  private buildAddNotePayload(form: IFinesAccAddNoteForm): IOpalFinesAddNotePayload {
    //mock construct the payload for adding a note
    return {
      associated_record_type: 'FinesAccount',
      associated_record_id: 123456789,
      note_type: 'account_note',
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
        // Navigate back to defendant details page on success
        this.handleReturnToDefendantDetails();
      },
      error: (err) => console.error('failed to add note', err),
    });
  }

  /**
   * Handles navigation back to the defendant details page.
   * Uses the current account ID from the store to construct the route.
   */
  public handleReturnToDefendantDetails(): void {
    const accountNumber = '1234567'; // Use the hardcoded account number
    if (accountNumber) {
      // Navigate to defendant details page using FINES_ACC routing structure
      const detailsRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/defendant/${accountNumber}/${FINES_ACC_ROUTING_PATHS.children.details}`;
      this.routerNavigate(detailsRoute, true);
    } else {
      console.error('Cannot navigate to details: No account number available');
      // Fallback navigation to the main fines account list
      this.routerNavigate(`/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}`, true);
    }
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
