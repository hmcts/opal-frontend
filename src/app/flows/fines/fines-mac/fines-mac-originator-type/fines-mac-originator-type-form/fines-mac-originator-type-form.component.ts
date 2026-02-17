import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { IFinesMacOriginatorTypeForm } from '../interfaces/fines-mac-originator-type-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { PAGES_ROUTING_PATHS } from '@app/pages/routing/constants/routing-paths.constant';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { FINES_ORIGINATOR_TYPES } from '@app/flows/fines/constants/fines-originator-types.constant';
import { IFinesMacOriginatorTypeFieldErrors } from '../interfaces/fines-mac-originator-type-field-errors.interface';
import { FINES_MAC_ORIGINATOR_TYPE_FIELD_ERRORS } from '../constants/fines-mac-originator-type-field-errors.constant';

@Component({
  selector: 'app-fines-mac-originator-type-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './fines-mac-originator-type-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOriginatorTypeFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacOriginatorTypeForm>();
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly routingPath = PAGES_ROUTING_PATHS;

  public readonly originatorTypes: IGovUkRadioOptions[] = Object.entries(FINES_ORIGINATOR_TYPES).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );
  public readonly originatorTypeKeys = FINES_ORIGINATOR_TYPES;

  override fieldErrors: IFinesMacOriginatorTypeFieldErrors = FINES_MAC_ORIGINATOR_TYPE_FIELD_ERRORS;

  /**
   * Initializes the originator type form with validation.
   * Creates a FormGroup containing a single FormControl for the originator type field,
   * which is required.
   *
   * @private
   * @returns {void}
   */
  private setupOriginatorTypeForm(): void {
    this.form = new FormGroup({
      fm_originator_type_originator_type: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Initializes the originator type form component.
   *
   * This method performs the initial setup by:
   * 1. Retrieving the form data from the fines MAC store's originator type state
   * 2. Setting up the originator type form structure
   * 3. Configuring initial error messages
   * 4. Re-populating the form with any existing form data
   *
   * @private
   * @returns {void}
   */
  private initialOriginatorTypeSetup(): void {
    const { formData } = this.finesMacStore.originatorType();
    this.setupOriginatorTypeForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  /**
   * Initializes the component after Angular has initialized all data-bound properties.
   * Sets up the initial originator type configuration before calling the parent class initialization.
   *
   * @override
   * @returns {void}
   */
  public override ngOnInit(): void {
    this.initialOriginatorTypeSetup();
    super.ngOnInit();
  }
}
