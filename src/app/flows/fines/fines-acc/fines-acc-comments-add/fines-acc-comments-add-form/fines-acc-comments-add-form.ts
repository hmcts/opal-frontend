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
  templateUrl: './fines-acc-comments-add-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccCommentsAddFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesAccStore = inject(FinesAccountStore);
  @Output() protected override formSubmit = new EventEmitter<IFinesAccAddCommentsForm>();
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly accountNumber = this.finesAccStore.getAccountNumber();
  protected readonly defendantName = this.finesAccStore.party_name();
  override fieldErrors: IFinesAccAddCommentsFieldErrors = FINES_ACC_ADD_COMMENTS_FIELD_ERRORS;
  @Input() public initialFormData?: IFinesAccAddCommentsFormState;

  private setupAddCommentsForm(): void {
    this.form = new FormGroup({
      facc_add_comment: new FormControl(this.initialFormData?.facc_add_comment || null, [
        Validators.maxLength(30),
        patternValidator(
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
          'alphanumericWithHyphensSpacesApostrophesDotPattern',
        ),
      ]),
      facc_add_free_text_1: new FormControl(this.initialFormData?.facc_add_free_text_1 || null, [
        Validators.maxLength(76),
        patternValidator(
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
          'alphanumericWithHyphensSpacesApostrophesDotPattern',
        ),
      ]),
      facc_add_free_text_2: new FormControl(this.initialFormData?.facc_add_free_text_2 || null, [
        Validators.maxLength(76),
        patternValidator(
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
          'alphanumericWithHyphensSpacesApostrophesDotPattern',
        ),
      ]),
      facc_add_free_text_3: new FormControl(this.initialFormData?.facc_add_free_text_3 || null, [
        Validators.maxLength(76),
        patternValidator(
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
          'alphanumericWithHyphensSpacesApostrophesDotPattern',
        ),
      ]),
    });
  }

  private initialAddCommentsSetup(): void {
    this.setupAddCommentsForm();
    this.setInitialErrorMessages();
  }

  public override ngOnInit(): void {
    this.initialAddCommentsSetup();
    super.ngOnInit();
  }
}
