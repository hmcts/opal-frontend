import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FIELD_ERRORS } from '../constants/fines-acc-enf-override-add-change-field-errors.constant';
import { OpalFines } from '@app/flows/fines/services/opal-fines-service/opal-fines.service';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '@app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { IFinesAccEnfOverrideAddChangeFormState } from '../interfaces/fines-acc-enf-override-add-change-form-state.interface';

@Component({
  selector: 'app-fines-enf-override-add-change-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    AlphagovAccessibleAutocompleteComponent,
  ],
  templateUrl: './fines-acc-enf-override-add-change-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfOverrideAddChangeFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private finesService = inject(OpalFines);
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FIELD_ERRORS,
  };
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfOverrideAddChangeFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  public defendantAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  @Input({ required: true }) enforcementActionOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) enforcerOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) localJusticeAreaOptions!: IGovUkSelectOptions[];

  /**
   * Sets up the enforcement override add/change form with the necessary form controls.
   */
  private setupEnforcementOverrideAddChangeForm(): void {
    this.form = new FormGroup({
      fenf_account_enforcement_action: new FormControl<string | null>(null, Validators.required),
      fenf_account_enforcement_enforcer: new FormControl<string | null>(null, Validators.required),
      fenf_account_enforcement_lja: new FormControl<string | null>(null, Validators.required),
    });
    this.disableFormControl('fenf_account_enforcement_enforcer');
    this.disableFormControl('fenf_account_enforcement_lja');
  }

  /**
   * Sets up event listeners for changing form values
   */
  private setupFormValueChangeListeners(): void {
    this.form.get('fenf_account_enforcement_action')?.valueChanges.subscribe((change: string | null): void => {
      this.handleChangeEnforcementAction(change ?? '');
    });
  }

  private getEnforcementActionResult(id: string): void {
    this.finesService.getResult(id).subscribe((result) => {
      console.log(result);
      this.disableFormControl('fenf_account_enforcement_lja');
      this.disableFormControl('fenf_account_enforcement_enforcer');
      if (result.requires_enforcer) {
        this.enableFormControl('fenf_account_enforcement_enforcer');
      }
      if (result.requires_lja) {
        this.enableFormControl('fenf_account_enforcement_lja');
      }
      this.form.updateValueAndValidity();
    });
  }

  /**
   * Enables a form control
   * @param controlName Name of the form field to enable
   */
  private enableFormControl(controlName: string): void {
    this.form.get(controlName)?.enable();
  }

  /**
   * Disables a form control and resets its value.
   * @param controlName Name of the form field to disable
   */
  private disableFormControl(controlName: string): void {
    this.form.get(controlName)?.reset();
    this.form.get(controlName)?.disable();
  }

  public override ngOnInit(): void {
    this.setupEnforcementOverrideAddChangeForm();
    this.setupFormValueChangeListeners();
    super.ngOnInit();
  }

  /**
   * Handles the change enforcement action event emitted from the form when a new enforcement action is selected.
   * @param id The result ID for the enforcement action that has been selected in the form
   * @returns void
   */
  public handleChangeEnforcementAction(id: string): void {
    this.getEnforcementActionResult(id);
  }
}
