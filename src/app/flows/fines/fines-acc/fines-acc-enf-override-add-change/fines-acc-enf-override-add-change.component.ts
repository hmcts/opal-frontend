import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOpalFinesResultsRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FinesAccEnfOverrideAddChangeFormComponent } from './fines-acc-enf-override-add-change-form/fines-acc-enf-override-add-change-form.component';
import { FinesAccountStore } from '@app/flows/fines/fines-acc/stores/fines-acc.store';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
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

@Component({
  selector: 'app-fines-acc-enf-override-add-change',
  templateUrl: './fines-acc-enf-override-add-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfOverrideAddChangeFormComponent, GovukHeadingWithCaptionComponent],
})
export class FinesAccEnfOverrideAddChangeComponent extends AbstractFormParentBaseComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);
  private finesAccStore = inject(FinesAccountStore);
  private finesAccPayloadService = inject(FinesAccPayloadService);
  private opalFinesService = inject(OpalFines);
  private utilsService = inject(UtilsService);
  private finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  public accountNumber = this.finesAccStore.getAccountNumber();
  public partyName = this.finesAccStore.party_name();
  public pageTitle = this.route.snapshot.data['pageHeading'] as string;
  public enforcerOptions: IGovUkSelectOptions[] = this.setEnforcerOptions();
  public localJusticeAreaOptions: IGovUkSelectOptions[] = this.setLocalJusticeAreaOptions();
  public enforcementActionOptions: IGovUkSelectOptions[] = this.setEnforcementActionOptions();

  private setEnforcerOptions(): IGovUkSelectOptions[] {
    return (this.route.snapshot.data['enforcersRefData'] as IOpalFinesEnforcersRefData).refData.map((enforcer) => ({
      value: enforcer.enforcer_id,
      name: this.opalFinesService.getEnforcerPrettyName(enforcer),
    }));
  }

  private setLocalJusticeAreaOptions(): IGovUkSelectOptions[] {
    return (this.route.snapshot.data['localJusticeAreasRefData'] as IOpalFinesLocalJusticeAreaRefData).refData.map(
      (lja) => ({
        value: lja.local_justice_area_id,
        name: this.opalFinesService.getLocalJusticeAreaPrettyName(lja),
      }),
    );
  }

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
        this.finesAccStore.setSuccessMessage('Enforcement override added');
        this.routerNavigate(this.finesDefendantRoutingPaths.children.details);
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

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
