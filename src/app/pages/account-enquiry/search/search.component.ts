import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  private readonly stateService = inject(StateService);
  public searchForm!: FormGroup;

  public readonly dateInputs: IGovUkDateInput = DATE_INPUTS;
  public readonly ctList: IGovUkSelectOptions[] = CT_LIST;

  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      courts: new FormControl(null),
      surname: new FormControl(null),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup({
        dayOfBirth: new FormControl(),
        monthOfBirth: new FormControl(),
        yearOfBirth: new FormControl(),
      }),
      addressLineOne: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
    });
  }

  public handleClearForm(): void {
    this.searchForm.reset();
  }

  public handleFormSubmit(): void {
    this.stateService.accountEnquiry.set({
      search: this.searchForm.value,
    });
    console.log(this.stateService.accountEnquiry());
  }

  public ngOnInit(): void {
    this.setupSearchForm();
  }
}
