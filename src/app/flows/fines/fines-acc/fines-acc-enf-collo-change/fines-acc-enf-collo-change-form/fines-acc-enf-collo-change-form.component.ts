import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit } from '@angular/core';
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
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { IFinesAccEnfColloChangeFormState } from '../interfaces/fines-acc-enf-collo-change-form-state.interface';
import { FINES_ACC_ENF_COLLO_CHANGE_FIELD_ERRORS } from '../constants/fines-acc-enf-collo-change-field-errors.constant';

@Component({
  selector: 'app-fines-acc-enf-collo-change-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
  ],
  templateUrl: './fines-acc-enf-collo-change-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FinesAccEnfColloChangeFormComponent extends AbstractFormBaseComponent implements OnInit {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_ACC_ENF_COLLO_CHANGE_FIELD_ERRORS,
  };
  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesAccEnfColloChangeFormState>>();
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  public readonly defendantAccRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;

  @Input({ required: true }) partyName!: string;
  @Input({ required: true }) accountNumber!: string;

  /**
   * Creates the form group for changing the Collection Order status.
   */
  private setupForm(): void {
    this.form = new FormGroup({
      facc_enf_collection_order_made: new FormControl<boolean | null>(null, Validators.required),
    });
  }

  /**
   * Initialises the form before running the shared abstract form setup.
   */
  public override ngOnInit(): void {
    this.setupForm();
    super.ngOnInit();
  }
}
