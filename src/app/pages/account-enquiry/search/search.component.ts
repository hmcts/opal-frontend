import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '@services';
import { GovukTextInputComponent } from '@components';

@Component({
  selector: 'app-account-enquiry',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, GovukTextInputComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly stateService = inject(StateService);
  public searchForm!: FormGroup;

  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      surname: new FormControl(null),
    });
  }

  public ngOnInit(): void {
    this.setupSearchForm();
  }
}
