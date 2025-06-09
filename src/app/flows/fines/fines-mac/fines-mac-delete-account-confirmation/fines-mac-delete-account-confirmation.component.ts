import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacDeleteAccountConfirmationForm } from './interfaces/fines-mac-delete-account-confirmation-form.interface';
import { FinesMacDeleteAccountConfirmationFormComponent } from './fines-mac-delete-account-confirmation-form/fines-mac-delete-account-confirmation-form.component';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { IFinesMacAddAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPatchAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-patch-account.interface';
import { ActivatedRoute } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../../fines-draft/fines-draft-check-and-validate/routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

@Component({
  selector: 'app-fines-mac-delete-account-confirmation',
  imports: [FinesMacDeleteAccountConfirmationFormComponent],
  templateUrl: './fines-mac-delete-account-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacDeleteAccountConfirmationComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly globalStore = inject(GlobalStore);
  private readonly userState = this.globalStore.userState();
  private readonly utilsService = inject(UtilsService);
  protected readonly finesMacStore = inject(FinesMacStore);
  protected readonly finesDraftStore = inject(FinesDraftStore);
  protected readonly opalFinesService = inject(OpalFines);
  private readonly dateService = inject(DateService);

  private readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  private readonly reviewAccountRoute = this.finesMacRoutes.children.reviewAccount;
  private readonly accountDetailsRoute = this.finesMacRoutes.children.accountDetails;
  public accountId = this.route.snapshot.paramMap.get('draftAccountId');
  public referrer = this.setReferrer();

  private readonly finesRoutes = FINES_ROUTING_PATHS;
  private readonly finesDraftRoutes = FINES_DRAFT_ROUTING_PATHS;
  private readonly finesDraftCheckAndValidateRoutes = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;
  private readonly checkAndValidateTabs = `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.checkAndValidate}/${this.finesDraftCheckAndValidateRoutes.children.tabs}`;

  public ngOnDestroy(): void {
    this.finesMacStore.setDeleteFromCheckAccount(false);
  }

  /**
   * Handles the submission of the delete account confirmation form.
   *
   * @param form - The form data for the account comments and notes.
   * @returns void
   */
  public handleDeleteAccountConfirmationSubmit(form: IFinesMacDeleteAccountConfirmationForm): void {
    this.finesMacStore.setDeleteAccountConfirmation(form);
    const payload = this.createPatchPayload(form);
    this.handlePatchRequest(payload);
  }

  /**
   * Creates the payload for the PATCH request to delete an account.
   *
   * @param form - The form data for the account comments and notes.
   * @returns {IFinesMacPatchAccountPayload} The payload containing the account information to be patched.
   */
  private createPatchPayload(form: IFinesMacDeleteAccountConfirmationForm): IFinesMacPatchAccountPayload {
    const reason_text = form.formData.fm_delete_account_confirmation_reason;
    const { version, timeline_data } = this.finesDraftStore.getFinesDraftState();
    const status_date = this.dateService.toFormat(this.dateService.getDateNow(), 'yyyy-MM-dd');
    const status = 'Deleted';
    const username = this.userState.name;
    const business_unit_id = this.finesMacStore.getBusinessUnitId();

    return {
      validated_by: null,
      account_status: status,
      validated_by_name: null,
      business_unit_id,
      version,
      timeline_data: [...timeline_data, { username, status, status_date, reason_text }],
    };
  }

  /**
   * Handles the PATCH request to update an account payload.
   *
   * @param payload - The payload containing the account information to be patched.
   *
   * This method sends the payload to the `opalFinesService` to update the draft account information.
   * It processes the response using `processPatchResponse` method and handles any errors by scrolling to the top of the page.
   * The request is automatically unsubscribed when the component is destroyed using `takeUntil` with `ngUnsubscribe`.
   */
  private handlePatchRequest(payload: IFinesMacPatchAccountPayload): void {
    if (!this.accountId) {
      console.error('Account ID is not defined');
      return;
    }

    this.opalFinesService
      .patchDraftAccountPayload(this.accountId, payload)
      .pipe(
        tap((response) => this.processPatchResponse(response)),
        catchError(() => {
          return of(this.handleRequestError());
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Handles the response from a patch request to delete an account.
   *
   * Updates the UI by setting a banner message indicating the account deletion,
   * resets any unsaved state changes, and navigates to the appropriate tab with
   * the current fragment.
   *
   * @param response - The payload returned from the patch request, containing account snapshot information.
   */
  private processPatchResponse(response: IFinesMacAddAccountPayload): void {
    const accountName = response.account_snapshot?.defendant_name;
    this.finesDraftStore.setBannerMessage(`You have deleted ${accountName}'s account`);
    this.finesMacStore.resetStateChangesUnsavedChanges();

    this['router'].navigate([this.checkAndValidateTabs], {
      fragment: this.finesDraftStore.fragment(),
    });
  }

  /**
   * Handles the request error by scrolling to the top of the page.
   *
   * @returns {null} Always returns null.
   */
  private handleRequestError(): null {
    this.utilsService.scrollToTop();
    return null;
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Sets the referrer for the delete account confirmation page.
   *
   * @returns {string} The referrer path to navigate back to the review account page.
   */
  private setReferrer(): string {
    if (this.finesDraftStore.checker()) return this.reviewAccountRoute;

    return this.finesMacStore.deleteFromCheckAccount() ? this.reviewAccountRoute : this.accountDetailsRoute;
  }
}
