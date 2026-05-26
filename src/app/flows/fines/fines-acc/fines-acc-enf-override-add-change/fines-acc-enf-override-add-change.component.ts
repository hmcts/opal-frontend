import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOpalFinesResultsRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FinesAccEnfOverrideAddChangeFormComponent } from './fines-acc-enf-override-add-change-form/fines-acc-enf-override-add-change-form.component';
import { FinesAccountStore } from '@app/flows/fines/fines-acc/stores/fines-acc.store';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { IOpalFinesEnforcersRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-enforcers-ref-data.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { FinesAccPayloadService } from '@app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from '@app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '@app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IFinesAccEnfOverrideAddChangeFormState } from './interfaces/fines-acc-enf-override-add-change-form-state.interface';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT } from './constants/fines-acc-enf-override-add-change-form-default.constant';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES } from './constants/fines-acc-enf-override-add-change-success-messages.constant';

@Component({
  selector: 'app-fines-acc-enf-override-add-change',
  templateUrl: './fines-acc-enf-override-add-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfOverrideAddChangeFormComponent],
})
export class FinesAccEnfOverrideAddChangeComponent
  extends AbstractFormParentBaseComponent
  implements OnDestroy, OnInit
{
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly finesAccPayloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  public accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public partyName = this.finesAccStore.party_name() ?? '';
  public pageTitle: string = this.route.snapshot.data['title'] ?? '';
  public enforcerOptions: IGovUkSelectOptions[] = this.setEnforcerOptions();
  public localJusticeAreaOptions: IGovUkSelectOptions[] = this.setLocalJusticeAreaOptions();
  public enforcementActionOptions: IGovUkSelectOptions[] = this.setEnforcementActionOptions();
  public formValues: IFinesAccEnfOverrideAddChangeFormState = structuredClone(
    FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT,
  );

  /**
   * Sets the existing enforcement override values to be used in the form.
   */
  private setExistingEnforcementOverride(): void {
    const existingEnforcementOverride = this.route.snapshot.data['enforcementStatus']?.enforcement_override;
    if (existingEnforcementOverride) {
      this.formValues = {
        fenf_account_enforcement_action:
          existingEnforcementOverride?.enforcement_override_result?.enforcement_override_result_id ?? null,
        fenf_account_enforcement_enforcer: existingEnforcementOverride?.enforcer?.enforcer_id ?? null,
        fenf_account_enforcement_lja: existingEnforcementOverride?.lja?.lja_id ?? null,
      };
    }
  }

  /**
   * Sets the options for the enforcer select dropdown.
   * @returns An array of IGovUkSelectOptions representing the enforcers.
   */
  private setEnforcerOptions(): IGovUkSelectOptions[] {
    return (this.route.snapshot.data['enforcersRefData'] as IOpalFinesEnforcersRefData).refData.map((enforcer) => ({
      value: enforcer.enforcer_id,
      name: this.opalFinesService.getEnforcerPrettyName(enforcer),
    }));
  }

  /**
   * Sets the options for the local justice area select dropdown.
   * @returns An array of IGovUkSelectOptions representing the local justice areas.
   */
  private setLocalJusticeAreaOptions(): IGovUkSelectOptions[] {
    return (this.route.snapshot.data['localJusticeAreasRefData'] as IOpalFinesLocalJusticeAreaRefData).refData.map(
      (lja) => ({
        value: lja.local_justice_area_id,
        name: this.opalFinesService.getLocalJusticeAreaPrettyName(lja),
      }),
    );
  }

  /**
   * Sets the options for the enforcement action select dropdown.
   * @returns An array of IGovUkSelectOptions representing the enforcement actions.
   */
  private setEnforcementActionOptions(): IGovUkSelectOptions[] {
    return (this.route.snapshot.data['resultsRefData'] as IOpalFinesResultsRefData).refData.map((result) => ({
      value: result.result_id,
      name: this.opalFinesService.getResultPrettyName(result),
    }));
  }

  /**
   * Handles the form submission for adding/removing/changing an enforcement override.
   * @param form - The form data containing the enforcement override details.
   */
  public handleFinesEnfOverrideAddChangeSubmit(
    form: IAbstractFormBaseForm<IFinesAccEnfOverrideAddChangeFormState>,
  ): void {
    const payload = this.finesAccPayloadService.buildEnforcementOverrideFormPayload(form.formData);
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
      .subscribe(() => {
        if (this.route.snapshot.data['enforcementStatus']?.enforcement_override) {
          this.finesAccStore.setSuccessMessage(FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES.change);
        } else {
          this.finesAccStore.setSuccessMessage(FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES.add);
        }
        this.routerNavigate(this.finesDefendantRoutingPaths.children.details, false, undefined, null, 'enforcement');
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

  /**
   * Unsubscribes from all active subscriptions to prevent memory leaks when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngOnInit(): void {
    this.setExistingEnforcementOverride();
  }
}
