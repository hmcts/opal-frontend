import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '@services';
import { GovukTextInputComponent } from '@components';
import { GovukRadiosComponent } from 'src/app/components/govuk-radios/govuk-radios.component';
import { IGovUkRadioData } from '@interfaces';
import { SEARCH_TYPE_RADIOS } from './config/search-type-radios';

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

  public radioDataArr: IGovUkRadioData[] = SEARCH_TYPE_RADIOS;

  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      surname: new FormControl(null),
      company: new FormControl(null),
      accountNumber: new FormControl(null),
      searchType: new FormControl(null),
    });
  }

  public ngOnInit(): void {
    this.setupSearchForm();
  }
}
