import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesAccCommentsAddFormComponent } from './fines-acc-comments-add-form/fines-acc-comments-add-form';
import { IFinesAccAddCommentsForm } from './interfaces/fines-acc-comments-add-form.interface';
import { IFinesAccAddCommentsFormState } from './interfaces/fines-acc-comments-add-form-state.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
@Component({
  selector: 'app-acc-comments-add',
  imports: [FinesAccCommentsAddFormComponent],
  templateUrl: './fines-acc-comments-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccCommentsAddComponent extends AbstractFormParentBaseComponent {
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly utilsService = inject(UtilsService);
  protected readonly finesAccStore = inject(FinesAccountStore);
  protected readonly finesAccPayloadService = inject(FinesAccPayloadService);

  protected readonly prefilledFormData: IFinesAccAddCommentsFormState = this['activatedRoute'].snapshot.data[
    'commentsFormData'
  ] || {
    facc_add_comment: null,
    facc_add_free_text_1: null,
    facc_add_free_text_2: null,
    facc_add_free_text_3: null,
  };

  /**
   * Handles the form submission for adding a note.
   * @param addNoteForm - The form data containing the note details.
   */
  public handleAddNoteSubmit(form: IFinesAccAddCommentsForm): void {
    this.opalFinesService
      .patchDefendantAccount(
        this.finesAccStore.party_id()!,
        this.finesAccPayloadService.buildCommentsFormPayload(form.formData, 1),
      )
      .subscribe({
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
