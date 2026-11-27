import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { FINES_SUSPENSE_ITEM_SEARCH_FIELD_ERRORS } from '../constants/fines-suspense-item-search-field-errors.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  EventEmitter,
  Input,
  input,
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
import {
  createSuspenseItemReferenceControl,
  normaliseSuspenseItemReferenceControl,
} from '../../utils/fines-suspense-item-reference-control.utils';

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
  public readonly pending = input(false);

  @Output() public businessUnitChange = new EventEmitter<number | null>();

  @Output() public cancelSearch = new EventEmitter<void>();

  /**
   * Restores the supplied BU but starts a fresh reference entry. Report BU changes
   * to the parent as they happen so the selection survives leaving without Continue.
   */
  private initialiseSearchForm(): void {
    const businessUnitControl = new FormControl<number | null>(this.initialBusinessUnitId, Validators.required);
    this.form = new FormGroup({
      fsis_business_unit_id: businessUnitControl,
      fsis_suspense_reference_number: createSuspenseItemReferenceControl(''),
    });
    this.setInitialErrorMessages();
    // Reset before the shared listener checks for unsaved changes.
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formSubmitted = false;
    });
    businessUnitControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((businessUnitId) => this.businessUnitChange.emit(businessUnitId));
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    // Ignore repeats before the shared submit handler can clear the leave warning.
    if (this.pending()) {
      event.preventDefault();
      return;
    }
    normaliseSuspenseItemReferenceControl(this.form.controls['fsis_suspense_reference_number']);
    super.handleFormSubmit(event);
  }

  /**
   * Initialises the form before enabling the shared form subscriptions.
   */
  public override ngOnInit(): void {
    this.initialiseSearchForm();
    super.ngOnInit();
  }
}
