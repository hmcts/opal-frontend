import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesAccAddNoteForm } from '../interfaces/fines-acc-note-add-form.interface';
import { IFinesAccAddNoteFieldErrors } from '../interfaces/fines-acc-note-add-form-field-errors.interface';
import { FINES_ACC_ADD_NOTE_FIELD_ERRORS } from '../constants/fines-acc-note-add-form-field-errors.constant';
import { ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FinesAccountStore } from '../../stores/fines-acc.store';


@Component({
  selector: 'app-fines-acc-note-add-form',
  imports: [
    GovukHeadingWithCaptionComponent,
    GovukTextAreaComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-acc-note-add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccNoteAddFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesAccStore = inject(FinesAccountStore);
  @Output() protected override formSubmit = new EventEmitter<IFinesAccAddNoteForm>();
  protected readonly finesAccRoutingPaths = FINES_ACC_ROUTING_PATHS;
  protected readonly accountNumber = this.finesAccStore.getAccountNumber();
  protected readonly defendantName = this.finesAccStore.party_name();
  override fieldErrors: IFinesAccAddNoteFieldErrors = FINES_ACC_ADD_NOTE_FIELD_ERRORS;

  /**
   * Sets up the account comments and notes form with the necessary form controls.
   */
  private setupAddNotesForm(): void {
    this.form = new FormGroup({
      facc_add_notes: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1000),
        patternValidator(
          ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
          'alphanumericWithHyphensSpacesApostrophesDotPattern',
        ),
      ]),
    });
  }

  /**
   * Performs the initial setup for the fines-acc-account-comments-notes-form component.
   * This method sets up the account comments notes form, and populates the form with data.
   */
  private initialAddNotesSetup(): void {
    this.setupAddNotesForm();
    this.setInitialErrorMessages();
  }

  /**
   * Initializes the component.
   *
   * This lifecycle hook performs the initial setup for adding notes by calling
   * the `initialAddNotesSetup()` method and subsequently invokes the base class's
   * `ngOnInit()` to ensure any inherited initialization logic is executed.
   *
   * @override
   */
  public override ngOnInit(): void {
    this.initialAddNotesSetup();
    super.ngOnInit();
  }
}
