import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FINES_ACC_ENF_ACTION_REMOVE_FIELD_ERRORS } from '../constants/fines-acc-enf-action-remove-field-errors.constant';
import { IFinesAccEnfActionRemoveFormState } from '../interfaces/fines-acc-enf-action-remove-form-state.interface';

const REASON_MAX_LENGTH = 24;
const REASON_PATTERN_VALIDATOR = patternValidator(/^[a-zA-Z0-9 '-]*$/, 'alphanumericWithHyphensSpacesApostrophesPattern');

@Component({
  selector: 'app-fines-acc-enf-action-remove-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-acc-enf-action-remove-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfActionRemoveFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = FINES_ACC_ENF_ACTION_REMOVE_FIELD_ERRORS;
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfActionRemoveFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  @Input({ required: true }) public accountNumber!: string;
  @Input({ required: true }) public pageTitle!: string;
  @Input({ required: true }) public partyName!: string;
  @Output() public cancelRequested = new EventEmitter<void>();

  /**
   * Sets up the remove enforcement hold form.
   */
  private setupForm(): void {
    this.form = new FormGroup({
      facc_enf_action_remove_reason: new FormControl<string | null>(null, [
        Validators.maxLength(REASON_MAX_LENGTH),
        REASON_PATTERN_VALIDATOR,
      ]),
    });
  }

  /**
   * Creates the form controls before the shared base component wiring runs.
   */
  public override ngOnInit(): void {
    this.setupForm();
    super.ngOnInit();
  }

  /**
   * Emits the cancel action to the parent component.
   */
  public handleCancel(): void {
    this.cancelRequested.emit();
  }
}
