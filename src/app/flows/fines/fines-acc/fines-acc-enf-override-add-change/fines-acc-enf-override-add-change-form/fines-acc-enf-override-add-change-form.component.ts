import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FIELD_ERRORS } from '../constants/fines-acc-enf-override-add-change-field-errors.constant';
import { OpalFines } from '@app/flows/fines/services/opal-fines-service/opal-fines.service';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '@app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { IFinesAccEnfOverrideAddChangeFormState } from '../interfaces/fines-acc-enf-override-add-change-form-state.interface';
import { takeUntil } from 'rxjs';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';

@Component({
  selector: 'app-fines-enf-override-add-change-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    AlphagovAccessibleAutocompleteComponent,
  ],
  templateUrl: './fines-acc-enf-override-add-change-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfOverrideAddChangeFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesService = inject(OpalFines);
  private _showEnforcerField = false;
  private _showLjaField = false;
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FIELD_ERRORS,
  };
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfOverrideAddChangeFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  public defendantAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;
  @Input({ required: true }) enforcementActionOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) enforcerOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) localJusticeAreaOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) partyName!: string;
  @Input({ required: true }) accountNumber!: string;
  @Input({ required: true }) pageTitle!: string;
  @Input({ required: true }) formValues!: IFinesAccEnfOverrideAddChangeFormState;

  public get showEnforcerField(): boolean {
    return this._showEnforcerField;
  }

  public get showLjaField(): boolean {
    return this._showLjaField;
  }

  /**
   * Sets up the enforcement override add/change form with the necessary form controls.
   * Populates the form with any existing enforcement override values if they are present.
   * @return void
   */
  private setupEnforcementOverrideAddChangeForm(): void {
    this.form = new FormGroup({
      fenf_account_enforcement_action: new FormControl<string | null>(null, Validators.required),
      fenf_account_enforcement_enforcer: new FormControl<string | null>(null),
      fenf_account_enforcement_lja: new FormControl<string | null>(null),
    });
    this.form.patchValue(this.formValues);
    this._showEnforcerField = !!this.formValues.fenf_account_enforcement_enforcer;
    this._showLjaField = !!this.formValues.fenf_account_enforcement_lja;
    this.updateControl('fenf_account_enforcement_enforcer', this.showEnforcerField ? [Validators.required] : []);
    this.updateControl('fenf_account_enforcement_lja', this.showLjaField ? [Validators.required] : []);
    this.form.updateValueAndValidity();
  }

  /**
   * Sets up event listeners for changing form values
   * @return void
   */
  private setupFormValueChangeListeners(): void {
    this.form
      .get('fenf_account_enforcement_action')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change: string | null): void => {
        this.handleChangeEnforcementAction(change ?? '');
      });
  }

  /**
   * Fetches the enforcement action result for the given ID.
   * Additionally enables/disables the enforcer and local justice area form controls based on the requirements of the selected enforcement action.
   * @param id Id of the result to fetch.
   * @return void
   */
  private getEnforcementActionResult(id: string): void {
    this.finesService
      .getResult(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.hideFieldAndResetValue('fenf_account_enforcement_lja');
        this.hideFieldAndResetValue('fenf_account_enforcement_enforcer');
        if (result.requires_enforcer) {
          this._showEnforcerField = true;
          this.updateControl('fenf_account_enforcement_enforcer', [Validators.required]);
        }
        if (result.requires_lja) {
          this._showLjaField = true;
          this.updateControl('fenf_account_enforcement_lja', [Validators.required]);
        }
        this.form.updateValueAndValidity();
      });
  }

  /**
   * Hides a field and resets its value.
   * @param controlName Name of the form field to hide
   * @returns void
   */
  private hideFieldAndResetValue(controlName: string): void {
    this.form.get(controlName)?.reset(null);
    if (controlName === 'fenf_account_enforcement_enforcer') {
      this._showEnforcerField = false;
      this.updateControl(controlName, []);
    }
    if (controlName === 'fenf_account_enforcement_lja') {
      this._showLjaField = false;
      this.updateControl(controlName, []);
    }
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * It sets up the form and the form value change listeners.
   * @returns void
   */
  public override ngOnInit(): void {
    this.setupEnforcementOverrideAddChangeForm();
    this.setupFormValueChangeListeners();
    super.ngOnInit();
  }

  /**
   * Handles the change enforcement action event emitted from the form when a new enforcement action is selected.
   * If an id is not provided (form value is cleared), the enforcer and local justice area form controls are disabled.
   * If an id is provided, the enforcement action result is fetched and appropriate form controls are enabled/disabled.
   * @param id The result ID for the enforcement action that has been selected in the form
   * @returns void
   */
  public handleChangeEnforcementAction(id: string): void {
    if (id) {
      this.getEnforcementActionResult(id);
    } else {
      this.hideFieldAndResetValue('fenf_account_enforcement_enforcer');
      this.hideFieldAndResetValue('fenf_account_enforcement_lja');
      this.form.updateValueAndValidity();
    }
  }
}
