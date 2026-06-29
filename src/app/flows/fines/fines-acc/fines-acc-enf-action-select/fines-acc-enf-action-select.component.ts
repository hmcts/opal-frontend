import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccEnfActionSelectFormState } from './interfaces/fines-acc-enf-action-select-form-state.interface';
import { FinesAccEnfActionSelectFormComponent } from './fines-acc-enf-action-select-form/fines-acc-enf-action-select-form.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES } from './constants/fines-acc-enf-action-select-warning-messages.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from './constants/fines-acc-enf-action-select-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_DENIED_TYPES } from '../fines-acc-enf-action-denied/constants/fines-acc-enf-action-denied-types.constant';
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages.component';

@Component({
  selector: 'app-fines-acc-enf-action-select',
  templateUrl: './fines-acc-enf-action-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccBannerMessagesComponent, FinesAccEnfActionSelectFormComponent],
})
export class FinesAccEnfActionSelectComponent extends AbstractFormParentBaseComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private readonly debtorTypes = FINES_ACC_DEBTOR_TYPES;
  public readonly finesAccStore = inject(FinesAccountStore);

  public readonly accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public readonly partyName = this.finesAccStore.party_name() ?? '';
  public actionOptions: IAlphagovAccessibleAutocompleteItem[] = [];
  public warningMessages: string[] = [];

  /**
   * Returns the resolved enforcement status payload for the current account.
   */
  private get enforcementStatus(): IOpalFinesAccountDefendantDetailsEnforcementTabRefData {
    return this.route.snapshot.data['enforcementStatus'] as IOpalFinesAccountDefendantDetailsEnforcementTabRefData;
  }

  /**
   * Loads warning copy for accounts that can still proceed but require operator awareness.
   */
  private setWarningMessages(): void {
    const headerData = this.route.snapshot.data[
      'defendantAccountHeadingData'
    ] as IOpalFinesAccountDefendantDetailsHeader;

    this.warningMessages = [];

    if (this.enforcementStatus.enforcement_overview.collection_order?.collection_order_flag === false) {
      this.warningMessages.push(FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES.collectionOrderMissing);
    }

    if (headerData.is_youth && headerData.debtor_type === this.debtorTypes.defendant) {
      this.warningMessages.push(FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES.youthAccount);
    }

    if (headerData.party_details.organisation_flag) {
      this.warningMessages.push(FINES_ACC_ENF_ACTION_SELECT_WARNING_MESSAGES.companyAccount);
    }
  }

  /**
   * Builds the autocomplete options for the actions returned by the route resolver.
   */
  private setActionOptions(): void {
    const nextPermittedEnfActions = this.route.snapshot.data['nextPermittedEnfActions'] as IOpalFinesResultsRefData;

    this.actionOptions = nextPermittedEnfActions.refData.map((result) => ({
      value: result.result_id,
      name: this.opalFinesService.getResultPrettyName(result),
    }));
  }

  /**
   * Applies the selected action result to the current flow state.
   */
  private processSelectedAction(selectedAction: IOpalFinesResultRefData): void {
    const requiresEmploymentData = !!selectedAction.requires_employment_data;
    const hasEmployerData = !!this.enforcementStatus.employer_flag;

    this.stateUnsavedChanges = false;
    this.finesAccStore.clearSuccessMessage();

    if (requiresEmploymentData && !hasEmployerData) {
      this['router'].navigate(
        [
          `../${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.denied}/${FINES_ACC_ENF_ACTION_DENIED_TYPES.employmentData}`,
        ],
        {
          relativeTo: this.route,
          queryParams: { resultId: selectedAction.result_id },
        },
      );
      return;
    }

    this['router'].navigate([`../${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.add}`], {
      relativeTo: this.route,
      queryParams: { resultId: selectedAction.result_id },
    });
  }

  /**
   * Handles a valid action selection.
   *
   * This ticket only introduces the selection step. The downstream action journeys are not present
   * in this branch yet, so valid submission currently clears dirty state after the result check.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccEnfActionSelectFormState>): void {
    const selectedActionId = form.formData.facc_enf_action!;

    this.opalFinesService
      .getResult(selectedActionId)
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((selectedAction) => this.processSelectedAction(selectedAction));
  }

  /**
   * Navigates back to the enforcement tab, preserving dirty-state behaviour for the canDeactivate guard.
   */
  public handleCancel(): void {
    this.routerNavigate(FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details, false, undefined, null, 'enforcement');
  }

  /**
   * Updates the parent guard state from the child form.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Seeds warning copy and selectable actions from resolved route data.
   */
  public ngOnInit(): void {
    this.setWarningMessages();
    this.setActionOptions();
  }

  /**
   * Completes the local teardown subject used to end active subscriptions.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
