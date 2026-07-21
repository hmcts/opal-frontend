import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form/fines-acc-note-add-form.component';
import { IFinesAccAddNoteForm } from './interfaces/fines-acc-note-add-form.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap } from 'rxjs';
import { FINES_ACC_PARTY_TYPES } from '../constants/fines-acc-party-types.constant';
import { OPAL_FINES_NOTE_RECORD_TYPES } from '@services/fines/opal-fines-service/constants/opal-fines-note-record-types.constant';
import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';

@Component({
  selector: 'app-acc-note-add',
  imports: [FinesAccNoteAddFormComponent],
  templateUrl: './fines-acc-note-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNoteAddComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  protected readonly defendantAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly utilsService = inject(UtilsService);
  protected readonly finesAccStore = inject(FinesAccountStore);
  protected readonly finesAccPayloadService = inject(FinesAccPayloadService);

  /**
   * Indicates whether the current account context is a minor creditor account.
   */
  private get isMinorCreditorAccount(): boolean {
    return this.finesAccStore.party_type() === FINES_ACC_PARTY_TYPES.minorCreditor;
  }

  /**
   * Subscribes to the Add Note API request and applies the shared success and error handling.
   *
   * @param request$ - The API request that persists the account note.
   * @param detailsRoute - The details route to return to after the note is saved.
   */
  private submitAddNoteRequest(request$: Observable<unknown>, detailsRoute: string): void {
    request$
      .pipe(
        tap(() => this.routerNavigate(detailsRoute)),
        catchError(() => {
          this.utilsService.scrollToTop();
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Builds the Add Note payload for the current account type.
   *
   * @param form - The submitted Add Note form data.
   * @returns The Add Note API payload for defendant or minor creditor accounts.
   */
  private buildCurrentAccountAddNotePayload(form: IFinesAccAddNoteForm): IOpalFinesAddNotePayload {
    if (this.isMinorCreditorAccount) {
      return this.finesAccPayloadService.buildAddNotePayload(form, OPAL_FINES_NOTE_RECORD_TYPES.minorCreditorAccounts);
    }

    return this.finesAccPayloadService.buildAddNotePayload(form);
  }

  /**
   * Handles the form submission for adding a note.
   *
   * @param form - The submitted Add Note form data.
   */
  public handleAddNoteSubmit(form: IFinesAccAddNoteForm): void {
    const payload = this.buildCurrentAccountAddNotePayload(form);
    const request$ = this.opalFinesService.addNote(payload, this.finesAccStore.base_version()!.toString(), this.finesAccStore.business_unit_id()!);

    this.submitAddNoteRequest(request$, this.defendantAccRoutingPaths.children.details);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
