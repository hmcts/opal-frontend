import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukDateInputComponent,
  GovukSelectComponent,
  GovukButtonComponent,
  AlphagovAccessibleAutocompleteComponent,
  GovukErrorSummaryComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesDividerComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosDividerComponent,
  GovukTextInputPrefixSuffixComponent,
  GovukSummaryCardListComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukSummaryCardActionComponent,
  ScotgovDatePickerComponent,
  FormBaseComponent,
} from '@components';
import { IAccountEnquiryStateSearch, IGovUkDateInput, IGovUkSelectOptions } from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';
import { overEighteenValidator } from 'src/app/validators';
import { ACCOUNT_ENQUIRY_SEARCH_FORM_FIELD_ERRORS } from '@constants';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukDateInputComponent,
    GovukSelectComponent,
    GovukButtonComponent,
    AlphagovAccessibleAutocompleteComponent,
    GovukErrorSummaryComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukCheckboxesDividerComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosDividerComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardListComponent,
    GovukSummaryCardActionComponent,
    ScotgovDatePickerComponent,
  ],
  templateUrl: './search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public selectOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) public state!: IAccountEnquiryStateSearch;

  @Output() private formSubmit = new EventEmitter<IAccountEnquiryStateSearch>();

  public readonly dateInputs: IGovUkDateInput = DATE_INPUTS;
  override fieldErrors = ACCOUNT_ENQUIRY_SEARCH_FORM_FIELD_ERRORS;
  override stateModel = this.stateService.accountEnquiry.search;

  /**
   * Sets up the search form with the necessary form controls.
   */
  private setupSearchForm(): void {
    this.form = new FormGroup({
      court: new FormControl(null, [Validators.required]),
      surname: new FormControl(null),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup(
        {
          dayOfMonth: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
          monthOfYear: new FormControl(null, [Validators.required]),
          year: new FormControl(null, [Validators.required]),
        },
        { validators: overEighteenValidator('dayOfMonth', 'monthOfYear', 'year') },
      ),
      addressLine: new FormControl(null),
      niNumber: new FormControl(null, [Validators.required]),
      pcr: new FormControl(null),
    });
  }

  /**
   * Repopulates the form data with either the snapshot form data or the regular form data,
   * depending on whether there are unsaved changes.
   */
  private repopulateSnapshotFormData(): void {
    const { snapshotFormData, formData } = this.stateService.accountEnquiry.search;
    if (this.stateUnsavedChanges) {
      this.rePopulateForm(snapshotFormData, true);
    } else {
      this.rePopulateForm(formData);
    }
  }

  /**
   * Sets the state of unsaved changes based on the snapshot form data.
   */
  private setStateUnsavedChanges(): void {
    const { snapshotFormData } = this.stateService.accountEnquiry.search;
    this.stateUnsavedChanges = !!snapshotFormData.court;
    this.unsavedChanges.emit(this.stateUnsavedChanges);
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();
    this.handleDateInputFormErrors();
    this.formSubmit.emit({
      formData: this.form.value,
      snapshotFormData: {} as any,
    });
  }

  public override ngOnInit(): void {
    this.setupSearchForm();
    this.setInitialErrorMessages();
    this.setStateUnsavedChanges();
    this.repopulateSnapshotFormData();
    super.ngOnInit();
  }
}
