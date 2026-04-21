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

@Component({
  selector: 'app-fines-acc-enf-action-select',
  templateUrl: './fines-acc-enf-action-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfActionSelectFormComponent],
})
export class FinesAccEnfActionSelectComponent extends AbstractFormParentBaseComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);

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
      this.warningMessages.push('There is no collection order on this account');
    }

    if (headerData.is_youth) {
      this.warningMessages.push('This is a youth account');
    }

    if (headerData.party_details.organisation_flag) {
      this.warningMessages.push('This is a company account');
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
      .subscribe((selectedAction) => {
        const requiresEmploymentData = !!selectedAction.requires_employment_data;
        const hasEmployerData = !!this.enforcementStatus.employer_flag;

        this.stateUnsavedChanges = false;

        if (requiresEmploymentData && !hasEmployerData) {
          return;
          //Submission logic handled in future ticket.
        }
      });
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
