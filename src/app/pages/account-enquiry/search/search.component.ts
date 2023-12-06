import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '@services';
import {
  GovukCheckboxesComponent,
  GovukRadiosComponent,
  GovukTextInputComponent,
  GovukDateInputComponent,
  GovukSelectComponent,
  GovukButtonComponent,
} from '@components';

import { IGovUkDateInput } from '@interfaces';
import { DATE_INPUTS } from './config/date-inputs';
import { CT_LIST } from './config/ct-list';

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  public readonly ctList = CT_LIST;

  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
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

  public formVals(): void {
    console.log(this.searchForm.value);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
  }
}
