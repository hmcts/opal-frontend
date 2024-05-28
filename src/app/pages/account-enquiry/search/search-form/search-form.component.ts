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
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();
    this.formSubmit.emit(this.form.value);
  }

  public override ngOnInit(): void {
    this.setupSearchForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.state);
    super.ngOnInit();
  }
}
