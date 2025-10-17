import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FinesAccCommentsAddFormComponent } from './fines-acc-comments-add-form/fines-acc-comments-add-form.component';
import { IFinesAccAddCommentsForm } from './interfaces/fines-acc-comments-add-form.interface';
import { IFinesAccAddCommentsFormState } from './interfaces/fines-acc-comments-add-form-state.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { catchError, EMPTY, Subject, takeUntil, tap } from 'rxjs';
import { FINES_ACC_ADD_COMMENTS_STATE } from './constants/fines-acc-comments-add-form-state.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';

@Component({
  selector: 'app-acc-comments-add',
  imports: [FinesAccCommentsAddFormComponent],
  templateUrl: './fines-acc-comments-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccCommentsAddComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  protected readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly utilsService = inject(UtilsService);
  protected readonly finesAccStore = inject(FinesAccountStore);
  protected readonly finesAccPayloadService = inject(FinesAccPayloadService);

  protected readonly prefilledFormData: IFinesAccAddCommentsFormState =
    this['activatedRoute'].snapshot.data['commentsFormData'] || FINES_ACC_ADD_COMMENTS_STATE;

  /**
   * Handles the form submission for adding a note.
   * @param addNoteForm - The form data containing the note details.
   */
  public handleAddNoteSubmit(form: IFinesAccAddCommentsForm): void {
    const payload = this.finesAccPayloadService.buildCommentsFormPayload(form.formData);
    this.opalFinesService
      .patchDefendantAccount(
        this.finesAccStore.account_id()!,
        payload,
        this.finesAccStore.base_version()!,
        this.finesAccStore.business_unit_id()!,
      )
      .pipe(
        tap(() => {
          this.routerNavigate(this.finesDefendantRoutingPaths.children.details);
        }),
        catchError(() => {
          this.utilsService.scrollToTop();
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Lifecycle hook that is called just before the component is destroyed.
   *
   * This method ensures that any subscriptions tied to the component lifecycle are properly terminated.
   * It does so by emitting a value on the `ngUnsubscribe` subject, signaling any active subscriptions to complete,
   * and then it completes the subject to free up resources.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
