import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { NUMERIC_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { FINES_SUSPENSE_ITEM_RESULTS_SEARCH_FIELD_ERRORS } from './constants/fines-suspense-item-results-search-field-errors.constant';
import { IFinesSuspenseItemResultsSearchFormState } from './interfaces/fines-suspense-item-results-search-form-state.interface';

@Component({
  selector: 'app-fines-suspense-item-results-search-form',
  imports: [ReactiveFormsModule, GovukButtonComponent, GovukErrorSummaryComponent, GovukTextInputComponent],
  templateUrl: './fines-suspense-item-results-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemResultsSearchFormComponent
  extends AbstractFormBaseComponent
  implements OnInit, OnChanges
{
  private readonly destroyRef = inject(DestroyRef);

  protected override fieldErrors = FINES_SUSPENSE_ITEM_RESULTS_SEARCH_FIELD_ERRORS;

  @Output() protected override formSubmit = new EventEmitter<
    IAbstractFormBaseForm<IFinesSuspenseItemResultsSearchFormState>
  >();

  public readonly initialReference = input.required<string>();
  public readonly businessUnitName = input.required<string>();

  private initialiseSearchForm(): void {
    this.form = new FormGroup({
      fsir_suspense_reference_number: new FormControl(this.initialReference(), {
        nonNullable: true,
        validators: [
          Validators.required,
          patternValidator(NUMERIC_PATTERN, 'numericalTextPattern'),
          patternValidator(/^0*\d{1,18}$/, 'maxlength'),
        ],
      }),
    });
    this.setInitialErrorMessages();
    // Reset before the shared listener checks edits made after a valid submission.
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formSubmitted = false;
    });
  }

  /** Restores the leave warning when the lookup fails or navigation is cancelled. */
  public restoreUnsavedChanges(): void {
    this.formSubmitted = false;
    this.unsavedChanges.emit(this.hasUnsavedChanges());
  }

  public override ngOnInit(): void {
    this.initialiseSearchForm();
    super.ngOnInit();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialReference'] && this.form) {
      this.form.reset({ fsir_suspense_reference_number: this.initialReference() });
      this.formSubmitted = false;
      this.setInitialErrorMessages();
      this.unsavedChanges.emit(false);
    }
  }
}
