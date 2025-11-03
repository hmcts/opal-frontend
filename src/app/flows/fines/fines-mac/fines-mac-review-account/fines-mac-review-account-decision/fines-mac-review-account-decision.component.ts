import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesMacReviewAccountDecisionFormComponent } from './fines-mac-review-account-decision-form/fines-mac-review-account-decision-form.component';
import { IFinesMacReviewAccountDecisionForm } from './interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../../../fines-draft/fines-draft-check-and-validate/routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_ROUTING_PATHS } from '../../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FinesDraftStore } from '../../../fines-draft/stores/fines-draft.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from '../../services/fines-mac-payload/fines-mac-payload.service';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IFinesMacAddAccountPayload } from '../../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-mac-review-account-decision',
  imports: [FinesMacReviewAccountDecisionFormComponent],
  templateUrl: './fines-mac-review-account-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountDecisionComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly opalFinesService = inject(OpalFines);
  private readonly globalStore = inject(GlobalStore);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly finesDraftStore = inject(FinesDraftStore);
  private readonly utilsService = inject(UtilsService);
  private readonly userState = this.globalStore.userState();
  private readonly finesRoutes = FINES_ROUTING_PATHS;
  private readonly finesDraftRoutes = FINES_DRAFT_ROUTING_PATHS;
  private readonly finesDraftCheckAndValidateRoutes = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;
  private readonly checkAndValidateTabs = `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.checkAndValidate}/${this.finesDraftCheckAndValidateRoutes.children.tabs}`;

  @Input({ required: true }) public accountId!: number;
  /**
   * Submits the decision made on a fines MAC review account form.
   *
   * Determines the account status based on the user's decision (approve or reject),
   * constructs the appropriate payload, and sends a patch request to update the draft account.
   * Handles the response by invoking a success handler or scrolling to the top on error.
   *
   * @param form - The form data containing the user's decision and reason.
   */
  private submitDecision(form: IFinesMacReviewAccountDecisionForm): void {
    const status =
      form.formData.fm_review_account_decision === 'approve'
        ? OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishPending
        : OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected;
    const payload = this.finesMacPayloadService.buildPatchAccountPayload(
      this.finesDraftStore.getFinesDraftState(),
      status,
      form.formData.fm_review_account_decision_reason,
      this.userState,
    );

    this.opalFinesService
      .patchDraftAccountPayload(this.finesDraftStore.draft_account_id()!, payload)
      .pipe(
        tap((response) => {
          this.successfulSubmission(response);
        }),
        catchError(() => {
          this.utilsService.scrollToTop();
          return of(null);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Handles the logic after a successful submission of a fines MAC account decision.
   * Sets an appropriate banner message based on the account status (approved or rejected),
   * resets unsaved state changes, and navigates to the relevant tab with the current fragment.
   *
   * @param response - The payload containing the account snapshot and status after submission.
   */
  private successfulSubmission(response: IFinesMacAddAccountPayload): void {
    const defendantName = this.finesMacPayloadService.getDefendantName(response);
    if (response.account_status === OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected) {
      this.finesDraftStore.setBannerMessageByType('rejected', defendantName);
    } else {
      this.finesDraftStore.setBannerMessageByType('approved', defendantName);
    }
    this.finesMacStore.resetStateChangesUnsavedChanges();

    this['router'].navigate([this.checkAndValidateTabs], {
      fragment: this.finesDraftStore.fragment(),
    });
  }

  /**
   * Handles the submission of the review account decision form.
   *
   * @param form - The form data containing the review account decision.
   */
  public handleFormSubmit(form: IFinesMacReviewAccountDecisionForm): void {
    this.submitDecision(form);
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   *
   * Cleans up subscriptions by emitting and completing the `ngUnsubscribe` subject,
   * and resets any global error state in the application by clearing the error message.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.globalStore.resetError();
  }
}
