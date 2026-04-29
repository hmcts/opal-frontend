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
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { FINES_ACC_ENF_ACTION_SELECT_FIELD_ERRORS } from '../constants/fines-acc-enf-action-select-field-errors.constant';
import { IFinesAccEnfActionSelectFormState } from '../interfaces/fines-acc-enf-action-select-form-state.interface';

@Component({
  selector: 'app-fines-acc-enf-action-select-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
  ],
  templateUrl: './fines-acc-enf-action-select-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfActionSelectFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_ACC_ENF_ACTION_SELECT_FIELD_ERRORS,
  };
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfActionSelectFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  @Input({ required: true }) public accountNumber!: string;
  @Input({ required: true }) public actionOptions!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public partyName!: string;
  @Input() public warningMessages: string[] = [];
  @Output() public cancelRequested = new EventEmitter<void>();

  /**
   * Sets up the select enforcement action form.
   */
  private setupForm(): void {
    this.form = new FormGroup({
      facc_enf_action: new FormControl<string | null>(null, Validators.required),
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
