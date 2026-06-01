import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, EMPTY } from 'rxjs';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccEnfActionAddFormComponent } from './fines-acc-enf-action-add-form/fines-acc-enf-action-add-form.component';
import { FinesAccEnfActionAddService } from './services/fines-acc-enf-action-add.service';
import { IFinesAccEnfActionAddFormState } from './interfaces/fines-acc-enf-action-add-form-state.interface';
import { IFinesAccEnfActionAddFormField } from './interfaces/fines-acc-enf-action-add-form-field.interface';
import { FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS } from './constants/fines-acc-enf-action-add-api-data-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from './constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERMS_RESULT_IDS } from './constants/fines-acc-enf-action-add-payment-terms-result-ids.constant';
import { IOpalFinesEnforcersRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcers-ref-data.interface';

const FIELD_TYPES = FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES;
const API_DATA_KEYS = FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS;

@Component({
  selector: 'app-fines-acc-enf-action-add',
  templateUrl: './fines-acc-enf-action-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FinesAccEnfActionAddFormComponent],
})
export class FinesAccEnfActionAddComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly addService = inject(FinesAccEnfActionAddService);
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
  public readonly partyName = this.accountState.party_name ?? '';
  public fields: IFinesAccEnfActionAddFormField[] = [];

  /**
   * Replaces dynamic API-backed menu fields with options resolved for this route.
   */
  private populateApiDataOptions(fields: IFinesAccEnfActionAddFormField[]): IFinesAccEnfActionAddFormField[] {
    return fields.map((field) => {
      if (field.type !== FIELD_TYPES.menuAutocomplete || field.apiData !== API_DATA_KEYS.enforcers) return field;

      const enforcers = this.route.snapshot.data['enforcersRefData'] as IOpalFinesEnforcersRefData | undefined;
      return {
        ...field,
        options:
          enforcers?.refData.map((enforcer) => ({
            value: enforcer.enforcer_id,
            name: this.opalFinesService.getEnforcerPrettyName(enforcer),
          })) ?? [],
      };
    });
  }

  /**
   * Returns the selected enforcement action result resolved before the page loads.
   */
  public get result(): IOpalFinesResultRefData {
    return this.route.snapshot.data['enforcementActionResult'] as IOpalFinesResultRefData;
  }

  /**
   * Builds the heading text for the selected enforcement action.
   */
  public get actionTitle(): string {
    return `${this.result.result_title} (${this.result.result_id})`;
  }

  /**
   * Determines whether this enforcement result should show the optional payment terms section.
   */
  public get showPaymentTerms(): boolean {
    return (
      !!this.result.allow_payment_terms ||
      FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERMS_RESULT_IDS.includes(this.result.result_id)
    );
  }

  /**
   * Submits the add enforcement action payload and routes to the next applicable enforcement step.
   */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesAccEnfActionAddFormState>): void {
    const payload = this.payloadService.buildEnforcementActionAddPayload(this.result, this.fields, form.formData);

    this.stateUnsavedChanges = false;

    this.opalFinesService
      .addEnforcementAction(
        Number(this.finesAccStore.account_id()),
        payload,
        this.finesAccStore.base_version() ?? undefined,
        this.finesAccStore.business_unit_id() ?? undefined,
      )
      .pipe(
        catchError(() => {
          this.stateUnsavedChanges = true;
          return EMPTY;
        }),
      )
      .subscribe(() => {
        if (this.result.allow_additional_action) {
          this.routerNavigate(
            `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
          );
          return;
        }

        this.routerNavigate(
          FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
          false,
          undefined,
          null,
          FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
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
   * Seeds account state and dynamic form fields from resolved route data.
   */
  public ngOnInit(): void {
    this.finesAccStore.setAccountState(this.accountState);
    const hasWelshLanguagePreference = this.finesAccStore.welsh_speaking() === 'Y';
    this.fields = this.populateApiDataOptions(
      this.addService.mapResultParamsToFormStructure(this.result.result_parameters, hasWelshLanguagePreference).fields,
    );
  }
}
