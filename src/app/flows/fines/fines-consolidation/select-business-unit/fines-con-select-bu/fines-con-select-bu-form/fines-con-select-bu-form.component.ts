import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { IFinesConSelectBuFieldErrors } from '../interfaces/fines-con-select-bu-field-errors.interface';
import { FINES_CON_SELECT_BU_FIELD_ERRORS } from '../constants/fines-con-select-bu-field-errors.constant';
import { IFinesConSelectBuForm } from '../interfaces/fines-con-select-bu-form.interface';
import { FINES_CON_SELECT_BU_FORM } from '../constants/fines-con-select-bu-form.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

@Component({
  selector: 'app-fines-con-select-bu-form',
  imports: [
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
    AlphagovAccessibleAutocompleteComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-con-select-bu-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSelectBuFormComponent extends AbstractFormBaseComponent implements OnInit {
  protected override fieldErrors: IFinesConSelectBuFieldErrors = FINES_CON_SELECT_BU_FIELD_ERRORS;
  protected readonly dashboardPath = PAGES_ROUTING_PATHS.children.dashboard;
  protected readonly routingPath = PAGES_ROUTING_PATHS;
  @Output() protected override unsavedChanges = new EventEmitter<boolean>();

  @Input({ required: true }) public autoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public defendantTypes!: IGovUkRadioOptions[];
  @Input({ required: false }) public initialFormData: IFinesConSelectBuForm = FINES_CON_SELECT_BU_FORM;
  /**
   * Sets up the form with business unit and defendant type controls
   */
  protected initialiseForm(): void {
    this.form = new FormGroup({
      fcon_select_bu_business_unit_id: new FormControl<string | null>(null, [Validators.required]),
      fcon_select_bu_defendant_type: new FormControl<string | null>('individual', [Validators.required]),
    });
  }

  /**
   * Initialize the form component following standard patterns
   */
  public override ngOnInit(): void {
    if (!this.initialFormData) {
      this.initialFormData = FINES_CON_SELECT_BU_FORM;
    }

    this.initialiseForm();
    this.rePopulateForm(this.initialFormData.formData || null);
    this.setInitialErrorMessages();
    super.ngOnInit();
  }
}
