import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base';
import {
  IAbstractFormBaseFormErrorSummaryMessage,
  IAbstractFormControlErrorMessage,
} from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';

@Component({
  selector: 'app-fines-sa-search-account-form-major-creditors',
  imports: [AlphagovAccessibleAutocompleteComponent],
  templateUrl: './fines-sa-search-account-form-major-creditors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormMajorCreditorsComponent extends AbstractNestedFormBaseComponent {
  protected readonly finesSaStore = inject(FinesSaStore);

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  @Input({ required: true }) public majorCreditorsAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  @Output() public formErrorSummaryMessagesChange = new EventEmitter<IAbstractFormBaseFormErrorSummaryMessage[]>();
  @Output() public filterBusinessUnitClicked = new EventEmitter<void>();

  /**
   * Constructs and returns a `FormGroup` for the major creditor form controls.
   *
   * @returns {FormGroup} A form group containing the form control for the major creditor ID.
   * The form control is initialized with a value of `null` and is required.
   */
  private buildMajorCreditorFormControls(): FormGroup {
    return new FormGroup({
      fsa_search_account_major_creditors_major_creditor_id: new FormControl<number | null>(null, [Validators.required]),
    });
  }

  /**
   * Initializes and sets up the form for major creditors.
   *
   * This method performs the following steps:
   * 1. Builds the form controls for the major creditor form.
   * 2. Adds the constructed controls to a nested form group.
   * 3. Re-populates the form with the search criteria for major creditors
   *    from the finesSaStore.
   * 4. Resets the defendant search criteria in the finesSaStore.
   *
   * @private
   */
  private setupMajorCreditorForm(): void {
    const majorCreditorForm = this.buildMajorCreditorFormControls();
    this.addControlsToNestedFormGroup(majorCreditorForm);
    this.rePopulateForm(this.finesSaStore.searchAccount().fsa_search_account_major_creditors_search_criteria);
    this.finesSaStore.resetDefendantSearchCriteria();
  }

  public override ngOnInit(): void {
    this.setupMajorCreditorForm();
    super.ngOnInit();
  }
}
