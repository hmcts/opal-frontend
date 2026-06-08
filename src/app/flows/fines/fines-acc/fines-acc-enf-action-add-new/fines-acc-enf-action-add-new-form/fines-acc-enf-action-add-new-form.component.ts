import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FINES_ACC_ENF_ACTION_ADD_NEW_FIELD_ERRORS } from '../constants/fines-acc-enf-action-add-new-field-errors.constant';
import { IFinesAccEnfActionAddNewFormState } from '../interfaces/fines-acc-enf-action-add-new-form-state.interface';

@Component({
  selector: 'app-fines-acc-enf-action-add-new-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
  ],
  templateUrl: './fines-acc-enf-action-add-new-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfActionAddNewFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_ACC_ENF_ACTION_ADD_NEW_FIELD_ERRORS,
  };
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfActionAddNewFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  @Input({ required: true }) public accountNumber!: string;
  @Input({ required: true }) public partyName!: string;

  private setupForm(): void {
    this.form = new FormGroup({
      facc_enf_action_add_new: new FormControl<boolean | null>(null, Validators.required),
    });
  }

  public override ngOnInit(): void {
    this.setupForm();
    super.ngOnInit();
  }
}
