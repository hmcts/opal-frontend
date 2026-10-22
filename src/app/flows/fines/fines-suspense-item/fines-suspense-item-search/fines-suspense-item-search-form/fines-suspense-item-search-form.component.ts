import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { IFinesSuspenseItemSearchFormState } from '../interfaces/fines-suspense-item-search-form-state.interface';

@Component({
  selector: 'app-fines-suspense-item-search-form',
  imports: [
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukTextInputComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-suspense-item-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemSearchFormComponent extends AbstractFormBaseComponent implements OnInit {
  @Output() protected override formSubmit = new EventEmitter<
    IAbstractFormBaseForm<IFinesSuspenseItemSearchFormState>
  >();

  @Input({ required: true }) public autoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public initialBusinessUnitId!: number | null;

  @Output() public cancelSearch = new EventEmitter<void>();

  /**
   * Creates the search controls using the supplied business-unit selection.
   */
  private initialiseSearchForm(): void {
    this.form = new FormGroup({
      fsis_business_unit_id: new FormControl<number | null>(this.initialBusinessUnitId),
      fsis_suspense_reference_number: new FormControl('', { nonNullable: true }),
    });
    this.setInitialErrorMessages();
  }

  /**
   * Initialises the form before enabling the shared form subscriptions.
   */
  public override ngOnInit(): void {
    this.initialiseSearchForm();
    super.ngOnInit();
  }
}
