import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '@services';
import {
  GovukCheckboxesComponent,
  GovukRadiosComponent,
  GovukTextInputComponent,
  GovukDateInputComponent,
  GovukSelectComponent,
  GovukButtonComponent,
} from '@components';

import { IGovUkDateInput, IGovUkSelectOptions } from '@interfaces';
import { DATE_INPUTS } from './config/date-inputs';

import CT_LIST from './data/ct-list.json';
import { AccountEnquiryRoutes } from '@enums';

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukRadiosComponent,
    GovukCheckboxesComponent,
    GovukDateInputComponent,
    GovukSelectComponent,
    GovukButtonComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly stateService = inject(StateService);

  public readonly dateInputs: IGovUkDateInput = DATE_INPUTS;
  public readonly ctList: IGovUkSelectOptions[] = CT_LIST;

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
      addressLineOne: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
    });
  }

  /**
   * Repopulates the search form with the data from the account enquiry search.
   */
  private rePopulateSearchForm(): void {
    const accountEnquirySearchData = this.stateService.accountEnquiry().search;
    this.searchForm.patchValue(accountEnquirySearchData);
  }

  /**
   * Clears the search form.
   */
  public handleClearForm(): void {
    this.searchForm.reset();
  }

  /**
   * Handles the form submission.
   */
  public handleFormSubmit(): void {
    this.stateService.accountEnquiry.set({
      search: this.searchForm.value,
    });

    this.router.navigate([AccountEnquiryRoutes.matches]);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this.rePopulateSearchForm();
  }
}
