import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { catchError, EMPTY } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_ENF_ACTION_REMOVE_SUCCESS_MESSAGE } from './constants/fines-acc-enf-action-remove-success-message.constant';
import { FinesAccEnfActionRemoveFormComponent } from './fines-acc-enf-action-remove-form/fines-acc-enf-action-remove-form.component';
import { IFinesAccEnfActionRemoveFormState } from './interfaces/fines-acc-enf-action-remove-form-state.interface';

@Component({
  selector: 'app-fines-acc-enf-action-remove',
  templateUrl: './fines-acc-enf-action-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfActionRemoveFormComponent],
})
export class FinesAccEnfActionRemoveComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly accountId = Number(this.route.snapshot.paramMap.get('accountId'));
  private readonly defendantAccountHeadingData = this.route.snapshot.data[
    'defendantAccountHeadingData'
  ] as IOpalFinesAccountDefendantDetailsHeader;
  private readonly accountState = this.payloadService.transformDefendantAccountHeaderForStore(
    this.accountId,
    this.defendantAccountHeadingData,
  );

  public readonly accountNumber = this.accountState.account_number ?? '';
  public readonly pageTitle = this.route.snapshot.data['title'] ?? 'Remove enforcement hold';
  public readonly partyName = this.accountState.party_name ?? '';

  /**
   * Removes the enforcement hold and routes to the additional enforcement action prompt.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccEnfActionRemoveFormState>): void {
    const reason = form.formData.facc_enf_action_remove_reason ?? '';

    this.stateUnsavedChanges = false;

    this.opalFinesService
      .removeEnforcementHold(
        Number(this.finesAccStore.account_id()),
        { reason },
        this.finesAccStore.business_unit_id()!,
        this.finesAccStore.base_version() ?? undefined,
      )
      .pipe(
        catchError(() => {
          this.stateUnsavedChanges = true;
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.opalFinesService.clearCache('defendantAccountEnforcementCache$');
        this.finesAccStore.setSuccessMessage(FINES_ACC_ENF_ACTION_REMOVE_SUCCESS_MESSAGE);
        this.routerNavigate(
          `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children['add-new']}`,
        );
      });
  }

  /**
   * Routes back to the enforcement tab without submitting changes.
   */
  public handleCancel(): void {
    this.routerNavigate(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
    );
  }

  /**
   * Receives dirty-state changes from the child form for the canDeactivate guard.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Seeds account state from resolved route data.
   */
  public ngOnInit(): void {
    this.finesAccStore.setAccountState(this.accountState);
  }
}
