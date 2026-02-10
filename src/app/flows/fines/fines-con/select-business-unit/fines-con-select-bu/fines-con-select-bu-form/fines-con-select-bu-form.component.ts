import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FinesConStore } from '../../../stores/fines-con.store';

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
  private readonly finesConStore = inject(FinesConStore);
  protected override fieldErrors: IFinesConSelectBuFieldErrors = FINES_CON_SELECT_BU_FIELD_ERRORS;
  protected readonly dashboardPath = PAGES_ROUTING_PATHS.children.dashboard;
  protected readonly routingPath = PAGES_ROUTING_PATHS;
  @Output() protected override unsavedChanges = new EventEmitter<boolean>();

  @Input({ required: true }) public autoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public defendantTypes!: IGovUkRadioOptions[];

  /**
   * Performs the initial setup for the select business unit form.
   * This method sets up the form, initializes error messages,
   * and repopulates the form with data from the store.
   */
  private initialiseSelectBuForm(): void {
    const { formData } = this.finesConStore.selectBuForm();
    this.initialiseForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  /**
   * Sets up the form with business unit and defendant type controls
   */
  protected initialiseForm(): void {
    this.form = new FormGroup({
      fcon_select_bu_business_unit_id: new FormControl(null, [Validators.required]),
      fcon_select_bu_defendant_type: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Initialize the form component following standard patterns
   */
  public override ngOnInit(): void {
    this.initialiseSelectBuForm();
    super.ngOnInit();
  }
}
