import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesMacReviewAccountDecisionForm } from '../interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DECISION_OPTIONS } from '../constants/fines-mac-review-account-decision-options.constant';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';

import { IFinesMacReviewAccountDecisionFieldErrors } from '../interfaces/fines-mac-review-account-decision-field-errors.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DECISION_FIELD_ERRORS } from '../constants/fines-mac-review-account-decision-field-errors.constant';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';

// regex pattern validators for the form controls
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);

@Component({
  selector: 'app-fines-mac-review-account-decision-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukTextAreaComponent,
    GovukButtonComponent,
  ],
  templateUrl: './fines-mac-review-account-decision-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountDecisionFormComponent extends AbstractFormBaseComponent implements OnInit {
  @Output() protected override formSubmit = new EventEmitter<IFinesMacReviewAccountDecisionForm>();

  @Input({ required: true }) public accountId!: number;
  public readonly DECISION_OPTIONS = FINES_MAC_REVIEW_ACCOUNT_DECISION_OPTIONS;
  public readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;
  override fieldErrors: IFinesMacReviewAccountDecisionFieldErrors = FINES_MAC_REVIEW_ACCOUNT_DECISION_FIELD_ERRORS;

  /**
   * Initializes the reactive form for the review account decision.
   *
   * The form contains two controls:
   * - `fm_review_account_decision`: A required field for the account decision.
   * - `fm_review_account_rejection_reason`: An optional field for the rejection reason,
   *   validated by `patternValidator`.
   *
   * This method assigns the constructed `FormGroup` to the `form` property.
   *
   * @private
   */
  private setupDecisionForm(): void {
    this.form = new FormGroup({
      fm_review_account_decision: new FormControl(null, [Validators.required]),
      fm_review_account_decision_reason: new FormControl(null, [ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR]),
    });
  }

  /**
   * Sets up a listener for changes to the 'fm_review_account_decision' form control.
   * Subscribes to the valueChanges observable and invokes the handleDecisionChange method
   * whenever the decision value changes. The subscription is automatically unsubscribed
   * when the component is destroyed, using the ngUnsubscribe subject.
   *
   * @private
   */
  private setupDecisionListener(): void {
    this.form
      .get('fm_review_account_decision')!
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((decision: string) => this.handleDecisionChange(decision));
  }

  /**
   * Handles changes to the decision selection in the form.
   *
   * Updates the validators for the 'fm_review_account_decision_reason' form control based on the selected decision.
   * - If the decision is 'reject', the decision reason becomes required.
   * - Otherwise, the required validator is removed.
   * The control is then reset and its validity is updated.
   *
   * @param decision - The selected decision value, typically 'reject' or another string.
   */
  private handleDecisionChange(decision: string): void {
    const decisionReasonControl = this.form.get('fm_review_account_decision_reason')!;
    if (decision === 'reject') {
      decisionReasonControl.addValidators([Validators.required]);
    } else {
      decisionReasonControl.removeValidators([Validators.required]);
    }
    decisionReasonControl.reset();
    decisionReasonControl.updateValueAndValidity();
  }

  /**
   * Initializes the decision form by performing the following steps:
   * 1. Sets up the decision form controls and structure.
   * 2. Attaches listeners to handle decision-related changes.
   * 3. Sets the initial error messages for the form.
   *
   * This method should be called during component initialization to ensure
   * the decision form is properly configured and ready for user interaction.
   *
   * @private
   */
  private initialDecisionFormSetup(): void {
    this.setupDecisionForm();
    this.setupDecisionListener();
    this.setInitialErrorMessages();
  }

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   *
   * This override performs the initial setup for the decision form by calling `initialDecisionFormSetup()`,
   * and then invokes the parent class's `ngOnInit()` method to ensure any inherited initialization logic is executed.
   */
  public override ngOnInit(): void {
    this.initialDecisionFormSetup();
    super.ngOnInit();
  }
}
