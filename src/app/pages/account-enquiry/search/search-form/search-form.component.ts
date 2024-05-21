import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukRadiosComponent,
  GovukCheckboxesComponent,
  GovukDateInputComponent,
  GovukSelectComponent,
  GovukButtonComponent,
  AlphagovAccessibleAutocompleteComponent,
  GovukErrorSummaryComponent,
  FormBaseComponent,
} from '@components';
import { IAccountEnquiryStateSearch, IGovUkDateInput, IGovUkSelectOptions } from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';
import { overEighteenValidator } from 'src/app/validators';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukRadiosComponent,
    GovukCheckboxesComponent,
    GovukDateInputComponent,
    GovukSelectComponent,
    GovukButtonComponent,
    AlphagovAccessibleAutocompleteComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent extends FormBaseComponent implements OnInit {
  @Input({ required: true }) public selectOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) public state!: IAccountEnquiryStateSearch;

  @Output() private formSubmit = new EventEmitter<IAccountEnquiryStateSearch>();

  public readonly dateInputs: IGovUkDateInput = DATE_INPUTS;

  // We will move this to a constant field in the future
  override fieldErrors = {
    court: {
      required: {
        message: 'Select a court',
        priority: 1,
      },
    },
    dayOfMonth: {
      required: {
        message: 'The date your passport was issued must include a day',
        priority: 1,
      },
      maxlength: {
        message: 'The day must be 2 characters or fewer',
        priority: 2,
      },
      underEighteen: {
        message: 'You need to be older than 18 years old',
        priority: 3,
      },
    },
    monthOfYear: {
      required: {
        message: 'The date your passport was issued must include a month',
        priority: 1,
      },
      underEighteen: {
        message: 'You need to be older than 18 years old',
        priority: 3,
      },
    },
    year: {
      required: {
        message: 'The date your passport was issued must include a year',
        priority: 1,
      },
      underEighteen: {
        message: 'You need to be older than 18 years old',
        priority: 3,
      },
    },
  };

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
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
    });
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this['handleErrorMessages']();
    this.formSubmit.emit(this.form.value);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this['setInitialErrorMessages']();
    this['rePopulateForm'](this.state);
  }
}
