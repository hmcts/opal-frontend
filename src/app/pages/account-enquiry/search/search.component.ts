import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '@services';
import { GovukCheckboxesComponent, GovukRadiosComponent, GovukTextInputComponent } from '@components';

import { IGovUkCheckboxesData, IGovUkRadioData } from '@interfaces';
import { SEARCH_TYPE_RADIOS } from './config/search-type-radios';

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
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private readonly stateService = inject(StateService);
  public searchForm!: FormGroup;

  public readonly radioDataArr: IGovUkRadioData[] = SEARCH_TYPE_RADIOS;

  public readonly checboxDataArr: any[] = [
    {
      inputName: 'checkbox',
      inputClasses: null,
      inputId: 'testOne',
      inputValue: 'testOne',
      inputLabel: 'Test One',
      inputTextDivider: 'DIV',
      inputHint: 'This is a hint',
      conditional: {
        inputName: 'conditionalOne',
        inputClasses: 'govuk-!-width-one-third',
        inputId: 'conditionalOne',
        inputLabel: 'ConditionalOne',
      },
    },
    {
      inputName: 'checkbox',
      inputClasses: null,
      inputId: 'testTwo',
      inputValue: 'testTwo',
      inputLabel: 'Test Two',
      inputTextDivider: null,
      inputHint: null,
      conditional: {
        inputName: 'conditionalTwo',
        inputClasses: 'govuk-!-width-one-third',
        inputId: 'conditionalTwo',
        inputLabel: 'ConditionalTwo',
      },
    },
  ];

  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      surname: new FormControl(null),
      company: new FormControl(null),
      accountNumber: new FormControl(null),
      radioGroup: new FormGroup({
        searchType: new FormControl(null),
        conditionalOne: new FormControl(),
        conditionalTwo: new FormControl(),
      }),
      nestedGroup: new FormGroup({
        testOne: new FormControl(false),
        testTwo: new FormControl(false),
        conditionalOne: new FormControl(),
        conditionalTwo: new FormControl(),
      }),
    });
  }

  public formVals(): void {
    console.log(this.searchForm.value);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
  }
}
