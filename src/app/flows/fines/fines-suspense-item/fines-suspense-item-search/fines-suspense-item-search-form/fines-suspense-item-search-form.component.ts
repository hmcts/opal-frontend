import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { FINES_SUSPENSE_ITEM_SEARCH_FIELD_ERRORS } from '../constants/fines-suspense-item-search-field-errors.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    GovukErrorSummaryComponent,
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
  private readonly destroyRef = inject(DestroyRef);

  protected override fieldErrors = FINES_SUSPENSE_ITEM_SEARCH_FIELD_ERRORS;

  @Output() protected override formSubmit = new EventEmitter<
    IAbstractFormBaseForm<IFinesSuspenseItemSearchFormState>
  >();

  @Input({ required: true }) public autoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public initialBusinessUnitId!: number | null;

  public readonly businessUnitChange = output<number | null>();

  @Output() public cancelSearch = new EventEmitter<void>();

  /**
   * Restores the supplied BU but starts a fresh reference entry. Report BU changes
   * to the parent as they happen so the selection survives leaving without Continue.
   */
  private initialiseSearchForm(): void {
    const businessUnitControl = new FormControl<number | null>(this.initialBusinessUnitId, Validators.required);
    this.form = new FormGroup({
      fsis_business_unit_id: businessUnitControl,
      fsis_suspense_reference_number: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
    this.setInitialErrorMessages();
    businessUnitControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((businessUnitId) => this.businessUnitChange.emit(businessUnitId));
  }

  /**
   * Initialises the form before enabling the shared form subscriptions.
   */
  public override ngOnInit(): void {
    this.initialiseSearchForm();
    super.ngOnInit();
  }
}
