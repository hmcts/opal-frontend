import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IFinesMacCourtDetailsForm } from '../interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_COURT_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-court-details-field-errors';
import { FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE } from '../../constants/fines-mac-court-details-copy.constant';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { IFinesAccountTypes } from '@app/flows/fines/interfaces/fines-account-types.interface';
import { IFinesMacCourtDetailsCopy } from '../../interfaces/fines-mac-court-details-copy.interface';
import { IFinesMacOriginatorRefData } from '../../routing/resolvers/fetch-originators-resolver/interfaces/fines-mac-originator-ref-data.interface';

//regex pattern validators for the form controls
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
@Component({
  selector: 'app-fines-mac-court-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-court-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  protected readonly finesMacStore = inject(FinesMacStore);
  @Output() protected override formSubmit = new EventEmitter<IFinesMacCourtDetailsForm>();
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  @Input() public defendantType!: string;
  @Input({ required: true }) public originators!: IFinesMacOriginatorRefData;
  @Input({ required: true }) public sendingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];

  private get currentCourtDetailsCopy(): IFinesMacCourtDetailsCopy {
    const accountType = this.finesMacStore.accountDetails().formData.fm_create_account_account_type;
    const accountTypeKey = accountType as keyof IFinesAccountTypes;

    return (
      FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE[accountTypeKey] ?? FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE.Fine
    );
  }

  public get sectionHeading(): string {
    return this.currentCourtDetailsCopy.sectionHeading;
  }

  public get originatorIdLabelText(): string {
    return this.currentCourtDetailsCopy.originatorLabel;
  }

  public get originatorHintText(): string {
    return this.currentCourtDetailsCopy.originatorHint;
  }

  /**
   * Sets field-specific error messages for the court details form.
   * Merges default field error definitions with account-type specific copy
   * for the originator ID field.
   *
   * @private
   */
  private setFieldErrors(): void {
    this.fieldErrors = {
      ...FINES_MAC_COURT_DETAILS_FIELD_ERRORS,
      fm_court_details_originator_id: {
        ...FINES_MAC_COURT_DETAILS_FIELD_ERRORS.fm_court_details_originator_id,
        required: {
          ...FINES_MAC_COURT_DETAILS_FIELD_ERRORS.fm_court_details_originator_id['required'],
          message: this.currentCourtDetailsCopy.originatorRequiredError,
        },
      },
    };
  }

  /**
   * Sets up the court details form with the necessary form controls.
   */
  private setupCourtDetailsForm(): void {
    this.form = new FormGroup({
      fm_court_details_originator_id: new FormControl(null, [Validators.required]),
      fm_court_details_prosecutor_case_reference: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
      fm_court_details_imposing_court_id: new FormControl(null, [Validators.required]),
      fm_court_details_originator_name: new FormControl(),
    });
  }

  /**
   * Retrieves the stored name for the selected prosecutor or local justice area.
   *
   * @param originatorId - The normalized originator ID as a string or null.
   * @returns The name of the originator if found, otherwise an empty string.
   */
  private getOriginatorName(originatorId: string | null): string {
    const originatorIdNumber = Number(originatorId); // Convert string to number
    const originator = this.originators.refData.find((item) => item.originatorId === originatorIdNumber);
    return originator ? originator.name : '';
  }

  /**
   * Sets the originator name from the selected originator ID.
   *
   * This method retrieves the value of the 'fm_court_details_originator_id' form control.
   * If the value is present, it sets the 'fm_court_details_originator_name' form control
   * with the corresponding prosecutor or local justice area name.
   *
   * @private
   */
  private setOriginatorName(): void {
    const originatorIdControl = this.form.get('fm_court_details_originator_id');

    if (originatorIdControl?.value) {
      this.form.get('fm_court_details_originator_name')?.setValue(this.getOriginatorName(originatorIdControl.value));
    }
  }

  /**
   * Performs the initial setup for the court details form.
   * This method sets up the court details form, initializes error messages,
   * and repopulates the form with the initial court details data.
   */
  private initialCourtDetailsSetup(): void {
    const { formData } = this.finesMacStore.courtDetails();
    this.setupCourtDetailsForm();
    this.setFieldErrors();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    this.setOriginatorName();
    super.handleFormSubmit(event);
  }

  public override ngOnInit(): void {
    this.initialCourtDetailsSetup();
    super.ngOnInit();
  }
}
