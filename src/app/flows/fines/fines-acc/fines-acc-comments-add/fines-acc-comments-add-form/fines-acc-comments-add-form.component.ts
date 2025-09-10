import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesAccAddCommentsForm } from '../interfaces/fines-acc-comments-add-form.interface';
import { IFinesAccAddCommentsFormState } from '../interfaces/fines-acc-comments-add-form-state.interface';
import { IFinesAccAddCommentsFieldErrors } from '../interfaces/fines-acc-comments-add-field-errors.interface';
import { FINES_ACC_ADD_COMMENTS_FIELD_ERRORS } from '../constants/fines-acc-comments-add-form-field-errors.constant';
import { ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FinesAccountStore } from '../../stores/fines-acc.store';

const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);

@Component({
  selector: 'app-fines-acc-comments-add-form',
  imports: [
    GovukHeadingWithCaptionComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-acc-comments-add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccCommentsAddFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesAccStore = inject(FinesAccountStore);
  @Output() protected override formSubmit = new EventEmitter<IFinesAccAddCommentsForm>();
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly accountNumber = this.finesAccStore.getAccountNumber();
  protected readonly defendantName = this.finesAccStore.party_name();
  override fieldErrors: IFinesAccAddCommentsFieldErrors = FINES_ACC_ADD_COMMENTS_FIELD_ERRORS;
  @Input({ required: true }) public initialFormData!: IFinesAccAddCommentsFormState;

  /**
   * Sets up the form for adding comments.
   *
   * This method initializes a new FormGroup with four FormControls:
   * - facc_add_comment: Accepts a value from initial form data and is validated with a maximum length of 30 characters alongside a custom validator allowing alphanumeric characters, hyphens, spaces, apostrophes, and dots.
   * - facc_add_free_text_1, facc_add_free_text_2, facc_add_free_text_3: These are also initialized with values from the initial form data and constrained to a maximum of 76 characters, using the same custom validator as above.
   *
   * The method ensures that each form control is correctly initialized whether or not initial data is provided.
   *
   * @private
   */
  private setupAddCommentsForm(): void {
    this.form = new FormGroup({
      facc_add_comment: new FormControl(this.initialFormData.facc_add_comment, [
        Validators.maxLength(30),
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
      ]),
      facc_add_free_text_1: new FormControl(this.initialFormData.facc_add_free_text_1, [
        Validators.maxLength(76),
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
      ]),
      facc_add_free_text_2: new FormControl(this.initialFormData.facc_add_free_text_2, [
        Validators.maxLength(76),
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
      ]),
      facc_add_free_text_3: new FormControl(this.initialFormData.facc_add_free_text_3, [
        Validators.maxLength(76),
        ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_VALIDATOR,
      ]),
    });
  }

  /**
   * Initializes the add comments feature by setting up the comments form and configuring the initial error messages.
   */
  private initialAddCommentsSetup(): void {
    this.setupAddCommentsForm();
    this.setInitialErrorMessages();
  }

  /**
   * Initializes the comment addition form component.
   *
   * This method sets up the initial configuration by invoking `initialAddCommentsSetup()`
   * and then delegates further initialization to the parent class by calling `super.ngOnInit()`.
   */
  public override ngOnInit(): void {
    this.initialAddCommentsSetup();
    super.ngOnInit();
  }
}
