import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FINES_ACC_ENF_COURT_CHANGE_FIELD_ERRORS } from '../constants/fines-acc-enf-court-change-field-errors.constant';
import { IFinesAccEnfCourtChangeFormState } from '../interfaces/fines-acc-enf-court-change-form-state.interface';

@Component({
  selector: 'app-fines-acc-enf-court-change-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
  ],
  templateUrl: './fines-acc-enf-court-change-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfCourtChangeFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_ACC_ENF_COURT_CHANGE_FIELD_ERRORS,
  };
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfCourtChangeFormState>>();
  @Output() public cancelRequested = new EventEmitter<void>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  @Input({ required: true }) public accountNumber!: string;
  @Input({ required: true }) public courtOptions!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public partyName!: string;

  /**
   * Sets up the enforcement court change form with the required court control.
   */
  private setupForm(): void {
    this.form = new FormGroup({
      facc_enf_court: new FormControl<number | null>(null, Validators.required),
    });
  }

  /**
   * Initializes the form before wiring up the shared form behaviour.
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
