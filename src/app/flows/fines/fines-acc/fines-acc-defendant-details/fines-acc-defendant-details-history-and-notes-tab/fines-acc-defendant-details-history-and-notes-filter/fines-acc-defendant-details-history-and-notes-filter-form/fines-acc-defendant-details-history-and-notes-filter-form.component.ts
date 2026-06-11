import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukDetailsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-details';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { dateBeforeValidator } from '@hmcts/opal-frontend-common/validators/date-before';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_CATEGORIES } from '../../constants/fines-acc-defendant-details-history-and-notes-filter-categories.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS } from '../../constants/fines-acc-defendant-details-history-and-notes-filter-field-errors.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT } from '../../constants/fines-acc-defendant-details-history-and-notes-filter-summary-text.constant';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterFieldErrors } from '../../interfaces/fines-acc-defendant-details-history-and-notes-filter-field-errors.interface';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterFormControls } from '../../interfaces/fines-acc-defendant-details-history-and-notes-filter-form-controls.interface';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../../interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';
import { TFinesAccDefendantDetailsHistoryAndNotesFilterCategory } from '../../types/fines-acc-defendant-details-history-and-notes-filter-category.type';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-fines-acc-defendant-details-history-and-notes-filter-form',
  imports: [
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukDetailsComponent,
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
  ],
  templateUrl: './fines-acc-defendant-details-history-and-notes-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsHistoryAndNotesFilterFormComponent
  extends AbstractFormBaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly dateService = inject(DateService);
  private readonly renderer = inject(Renderer2);
  private detailsToggleUnlistener: (() => void) | null = null;

  @ViewChild('filterDetails', { read: ElementRef }) private readonly filterDetails!: ElementRef<HTMLElement>;
  @Output() protected override formSubmit = new EventEmitter<IFinesAccDefendantDetailsHistoryAndNotesFilterForm>();
  protected override fieldErrors: IFinesAccDefendantDetailsHistoryAndNotesFilterFieldErrors =
    FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS;

  public readonly categories = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_CATEGORIES;
  public readonly filterDetailsSummaryText = signal<string>(
    FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT.show,
  );

  /**
   * Creates the filter form controls for date range and history categories.
   */
  private setupFilterForm(): void {
    this.form = new FormGroup<IFinesAccDefendantDetailsHistoryAndNotesFilterFormControls>({
      dateFrom: this.createFormControl([optionalValidDateValidator()]),
      dateTo: this.createFormControl([optionalValidDateValidator()]),
      categories: new FormRecord<FormControl<boolean>>(
        FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_CATEGORIES.reduce<Record<string, FormControl<boolean>>>(
          (controls, category) => {
            controls[category.value] = new FormControl(false, { nonNullable: true });
            return controls;
          },
          {},
        ),
      ),
    });
  }

  /**
   * Gets the parsed from-date used by the to-date validator.
   *
   * @returns The parsed from-date, or null when no valid source value is available.
   */
  private getDateFromValidatorTarget(): Date | null {
    const dateFrom = this.dateFromControl.value;
    return dateFrom ? this.dateService.getDateFromFormat(dateFrom, 'dd/MM/yyyy') : null;
  }

  /**
   * Updates the to-date validators using the current from-date value.
   */
  private updateDateToValidators(): void {
    this.updateControl('dateTo', [
      optionalValidDateValidator(),
      dateBeforeValidator(this.getDateFromValidatorTarget()),
    ]);
  }

  /**
   * Registers a listener to refresh to-date validation when from-date changes.
   */
  private setupDateFromValidatorListener(): void {
    this.dateFromControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updateDateToValidators();
    });
  }

  /**
   * Sets up the GOV.UK details summary text listener after the filter details element is available.
   */
  public ngAfterViewInit(): void {
    const detailsElement = this.filterDetails.nativeElement.querySelector('details');

    if (detailsElement) {
      this.detailsToggleUnlistener = this.renderer.listen(detailsElement, 'toggle', () => {
        this.filterDetailsSummaryText.set(
          detailsElement.open
            ? FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT.hide
            : FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT.show,
        );
      });
    }
  }

  /**
   * Cleans up the details toggle listener and inherited form subscriptions.
   */
  public override ngOnDestroy(): void {
    this.detailsToggleUnlistener?.();
    super.ngOnDestroy();
  }

  /**
   * Gets a typed category checkbox control from the categories form record.
   *
   * @param categoryValue - The category key to retrieve.
   * @returns The matching category checkbox control.
   */
  public getCategoryControl(
    categoryValue: TFinesAccDefendantDetailsHistoryAndNotesFilterCategory,
  ): FormControl<boolean> {
    return this.form.controls['categories'].get(categoryValue) as FormControl<boolean>;
  }

  /**
   * Gets the from-date control.
   *
   * @returns The from-date form control.
   */
  public get dateFromControl(): FormControl<string | null> {
    return this.form.controls['dateFrom'] as FormControl<string | null>;
  }

  /**
   * Gets the to-date control.
   *
   * @returns The to-date form control.
   */
  public get dateToControl(): FormControl<string | null> {
    return this.form.controls['dateTo'] as FormControl<string | null>;
  }

  /**
   * Initialises the filter form, validation listeners, and base form state.
   */
  public override ngOnInit(): void {
    this.setupFilterForm();
    this.setupDateFromValidatorListener();
    this.setInitialErrorMessages();
    super.ngOnInit();
  }
}
