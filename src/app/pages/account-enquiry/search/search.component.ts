import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '@services';
import { GovukTextInputComponent } from '@components';
import { GovukRadiosComponent } from 'src/app/components/govuk-radios/govuk-radios.component';

const TEST_RADIO_OBJ = [
  {
    inputName: 'test',
    inputClasses: '',
    inputId: 'test-1',
    inputValue: 'test 1',
    inputLabel: 'Test 1',
    inputTextDivider: null,
    inputHint: null,
  },
  {
    inputName: 'test',
    inputClasses: '',
    inputId: 'test-2',
    inputValue: 'test 2',
    inputLabel: 'Test 2',
    inputTextDivider: null,
    inputHint: null,
  },
  {
    inputName: 'test',
    inputClasses: '',
    inputId: 'test-3',
    inputValue: 'test 3',
    inputLabel: 'Test 3',
    inputTextDivider: null,
    inputHint: null,
  },
];

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, GovukTextInputComponent, GovukRadiosComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private readonly stateService = inject(StateService);
  public searchForm!: FormGroup;

  public testRadioObj = TEST_RADIO_OBJ;

  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      textInput: new FormControl(null),
      radioInput: new FormControl(null),
    });
  }

  public ngOnInit(): void {
    this.setupSearchForm();
  }
}
