import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccEnfCourtChangeFormComponent } from './fines-acc-enf-court-change-form/fines-acc-enf-court-change-form.component';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FINES_ACC_ENF_COURT_CHANGE_SUCCESS_MESSAGE } from './constants/fines-acc-enf-court-change-success-message.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { IFinesAccEnfCourtChangeFormState } from './interfaces/fines-acc-enf-court-change-form-state.interface';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-fines-acc-enf-court-change',
  templateUrl: './fines-acc-enf-court-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfCourtChangeFormComponent],
})
export class FinesAccEnfCourtChangeComponent extends AbstractFormParentBaseComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly finesAccPayloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private currentEnforcementCourtId!: number;

  public accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public partyName = this.finesAccStore.party_name() ?? '';
  public courtOptions: IAlphagovAccessibleAutocompleteItem[] = this.setCourtOptions();

  /**
   * Maps the resolved courts reference data into autocomplete options.
   *
   * @returns The list of courts formatted for the autocomplete component.
   */
  private setCourtOptions(): IAlphagovAccessibleAutocompleteItem[] {
    return (this.route.snapshot.data['courtsRefData'] as IOpalFinesCourtRefData).refData.map((court) => ({
      value: court.court_id,
      name: this.opalFinesService.getCourtPrettyName(court),
    }));
  }

  /**
   * Loads the current enforcement court id from cached enforcement status data.
   */
  private loadCurrentEnforcementCourtId(): void {
    this.opalFinesService
      .getDefendantAccountEnforcementStatus(this.finesAccStore.account_id()!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((enforcementStatus) => {
        this.currentEnforcementCourtId = enforcementStatus.enforcement_overview.enforcement_court.court_id;
      });
  }

  /**
   * Navigates back to the enforcement tab and optionally sets the success banner.
   *
   * @param setSuccessMessage Whether to set the success banner before navigating away.
   */
  private navigateToEnforcementTab(setSuccessMessage: boolean): void {
    this.stateUnsavedChanges = false;

    if (setSuccessMessage) {
      this.finesAccStore.setSuccessMessage(FINES_ACC_ENF_COURT_CHANGE_SUCCESS_MESSAGE);
    }

    this.routerNavigate(FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details, false, undefined, null, 'enforcement');
  }

  /**
   * Submits the selected enforcement court unless it matches the current value.
   *
   * @param form The submitted form containing the selected enforcement court.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccEnfCourtChangeFormState>): void {
    const selectedCourtId = Number(form.formData.facc_enf_court);

    if (selectedCourtId === this.currentEnforcementCourtId) {
      this.navigateToEnforcementTab(false);
      return;
    }

    const payload = this.finesAccPayloadService.buildEnforcementCourtFormPayload(form.formData);
    this.opalFinesService
      .patchDefendantAccount(
        this.finesAccStore.account_id()!,
        payload,
        this.finesAccStore.base_version()!,
        this.finesAccStore.business_unit_id()!,
      )
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => this.navigateToEnforcementTab(true));
  }

  /**
   * Navigates back to the enforcement tab without saving changes.
   */
  public handleCancel(): void {
    this.navigateToEnforcementTab(false);
  }

  /**
   * Updates the page-level unsaved changes state from the child form.
   *
   * @param unsavedChanges Whether the form currently has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Initializes component data that depends on cached account services.
   */
  public ngOnInit(): void {
    this.loadCurrentEnforcementCourtId();
  }

  /**
   * Completes the destroy notifier used by active subscriptions.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
