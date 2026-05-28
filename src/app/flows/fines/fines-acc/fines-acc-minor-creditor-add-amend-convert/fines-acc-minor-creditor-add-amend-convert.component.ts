import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountMinorCreditorCreditor } from '../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { IFinesAccMinorCreditorAddAmendConvertForm } from './interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { FinesAccMinorCreditorAddAmendConvertFormComponent } from './fines-acc-minor-creditor-add-amend-convert-form/fines-acc-minor-creditor-add-amend-convert-form.component';

@Component({
  selector: 'app-fines-acc-minor-creditor-add-amend-convert',
  imports: [FinesAccMinorCreditorAddAmendConvertFormComponent],
  templateUrl: './fines-acc-minor-creditor-add-amend-convert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorAddAmendConvertComponent
  extends AbstractFormParentBaseComponent
  implements OnDestroy
{
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly utilsService = inject(UtilsService);
  private readonly minorCreditorData = this.route.snapshot.data[
    'minorCreditorAccountCreditor'
  ] as IOpalFinesAccountMinorCreditorCreditor;

  protected readonly prefilledFormData: IFinesAccMinorCreditorAddAmendConvertForm = this.getPrefilledFormData();

  /**
   * Maps resolved minor creditor creditor-tab data into the form wrapper used by the child form component.
   *
   * @returns The prefilled form data for the minor creditor amend form
   */
  private getPrefilledFormData(): IFinesAccMinorCreditorAddAmendConvertForm {
    return {
      formData: this.payloadService.mapMinorCreditorAccountPayload(this.minorCreditorData),
      nestedFlow: false,
    };
  }

  /**
   * Navigates back to the minor creditor details page with the creditor tab selected.
   */
  private navigateToCreditorTab(): void {
    this.stateUnsavedChanges = false;
    this.routerNavigate(
      FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details,
      false,
      undefined,
      undefined,
      'creditor',
    );
  }

  /**
   * Handles submission from the child amend form and persists the updated minor creditor details.
   *
   * @param formData - The submitted minor creditor amend form data
   */
  public handleFormSubmit(formData: IFinesAccMinorCreditorAddAmendConvertForm): void {
    const payload = this.payloadService.buildMinorCreditorAccountAmendPayload(
      this.minorCreditorData,
      formData.formData,
    );

    this.opalFinesService
      .updateMinorCreditorAccount(
        this.finesAccStore.account_id()!,
        payload,
        this.finesAccStore.base_version()!,
        this.finesAccStore.business_unit_id()!,
      )
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          this.stateUnsavedChanges = true;
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => {
        this.opalFinesService.clearCache('minorCreditorAccountCreditorCache$');
        this.opalFinesService.clearCache('minorCreditorAccountAtAGlanceCache$');
        this.navigateToCreditorTab();
      });
  }

  /**
   * Navigates back to the Creditor tab without saving.
   *
   * This intentionally preserves unsaved state so the canDeactivate guard can warn
   * when the child form has emitted dirty state.
   */
  public handleCancel(): void {
    this.routerNavigate(
      FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      'creditor',
    );
  }

  /**
   * Updates the page-level unsaved changes state from the child form.
   *
   * @param unsavedChanges - Whether the child form currently has unsaved changes
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Completes the teardown notifier used by active subscriptions.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
