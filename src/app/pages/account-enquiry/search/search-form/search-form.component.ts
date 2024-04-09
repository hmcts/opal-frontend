import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukRadiosComponent,
  GovukCheckboxesComponent,
  GovukDateInputComponent,
  GovukSelectComponent,
  GovukButtonComponent,
} from '@components';
import { IAccountEnquiryStateSearch, IGovUkDateInput, IGovUkSelectOptions } from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';

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
  ],
  templateUrl: './search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit {
  @Input({ required: true }) public selectOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) public state!: IAccountEnquiryStateSearch;
  @Output() private formSubmit = new EventEmitter<IAccountEnquiryStateSearch>();

  public readonly dateInputs: IGovUkDateInput = DATE_INPUTS;

  public searchForm!: FormGroup;

  /**
   * Sets up the search form with the necessary form controls.
   */
  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      court: new FormControl(null),
      surname: new FormControl(null),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup({
        dayOfMonth: new FormControl(null),
        monthOfYear: new FormControl(null),
        year: new FormControl(null),
      }),
      addressLine: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
    });
  }

  /**
   * Repopulates the search form with the data from the account enquiry search.
   */
  private rePopulateSearchForm(): void {
    this.searchForm.patchValue(this.state);
  }

  /**
   * Clears the search form.
   */
  public handleClearForm(): void {
    this.searchForm.reset();
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.formSubmit.emit(this.searchForm.value);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this.rePopulateSearchForm();
  }
}
