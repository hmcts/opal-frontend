import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukDetailsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-details';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { dateBeforeValidator } from '@hmcts/opal-frontend-common/validators/date-before';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { takeUntil } from 'rxjs';
import { IFinesAccHistoryAndNotesFilterCategory } from '../interfaces/fines-acc-history-and-notes-filter-category.interface';
import { IFinesAccHistoryAndNotesFilterFormControls } from '../interfaces/fines-acc-history-and-notes-filter-form-controls.interface';
import { IFinesAccHistoryAndNotesFilterForm } from '../interfaces/fines-acc-history-and-notes-filter-form.interface';
import { IFinesAccHistoryAndNotesFilterSummaryText } from '../interfaces/fines-acc-history-and-notes-filter-summary-text.interface';

type TFinesAccHistoryAndNotesFilterFormValue = {
  dateFrom?: string | null;
  dateTo?: string | null;
  categories?: Record<string, boolean>;
};

@Component({
  selector: 'app-fines-acc-history-and-notes-filter-form',
  imports: [
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukDetailsComponent,
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
  ],
  templateUrl: './fines-acc-history-and-notes-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccHistoryAndNotesFilterFormComponent
  extends AbstractFormBaseComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('filterDetails', { read: ElementRef }) private readonly filterDetails!: ElementRef<HTMLElement>;
  private readonly dateService = inject(DateService);
  private readonly renderer = inject(Renderer2);
  private detailsToggleUnlistener: (() => void) | null = null;
  private summaryText: IFinesAccHistoryAndNotesFilterSummaryText = { show: 'Show filters', hide: 'Hide filters' };

  @Output() protected override formSubmit = new EventEmitter<IFinesAccHistoryAndNotesFilterForm>();
  @Output() public filterOpenChange = new EventEmitter<boolean>();

  @Input() public categories: IFinesAccHistoryAndNotesFilterCategory[] = [];
  @Input() public filterForm: IFinesAccHistoryAndNotesFilterForm | null = null;
  @Input() public filterOpen = false;
  @Input() public set filterFieldErrors(fieldErrors: IAbstractFormBaseFieldErrors) {
    this.fieldErrors = fieldErrors;
  }
  @Input() public set filterSummaryText(summaryText: IFinesAccHistoryAndNotesFilterSummaryText) {
    this.summaryText = summaryText;
    this.updateFilterDetailsSummaryText(this.filterOpen);
  }

  public readonly filterDetailsSummaryText = signal<string>(this.summaryText.show);

  /**
   * Creates the filter form controls for date range and history categories.
   */
  private setupFilterForm(): void {
    this.form = new FormGroup<IFinesAccHistoryAndNotesFilterFormControls>({
      dateFrom: this.createFormControl([optionalValidDateValidator()]),
      dateTo: this.createFormControl([optionalValidDateValidator()]),
      categories: new FormRecord<FormControl<boolean>>(
        this.categories.reduce<Record<string, FormControl<boolean>>>((controls, category) => {
          controls[category.value] = new FormControl(false, { nonNullable: true });
          return controls;
        }, {}),
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
   * Updates the details summary text to reflect the open state.
   *
   * @param open - Whether the filter details are open.
   */
  private updateFilterDetailsSummaryText(open: boolean): void {
    this.filterDetailsSummaryText.set(open ? this.summaryText.hide : this.summaryText.show);
  }

  /**
   * Gets the rendered GOV.UK details element.
   *
   * @returns The details element, or null when the view is not ready.
   */
  private getFilterDetailsElement(): HTMLDetailsElement | null {
    return this.filterDetails?.nativeElement.querySelector('details') ?? null;
  }

  /**
   * Sets the rendered filter details open state.
   *
   * @param open - Whether the filter details should be open.
   */
  private setFilterDetailsOpen(open: boolean): void {
    const detailsElement = this.getFilterDetailsElement();

    if (detailsElement) {
      detailsElement.open = open;
    }

    this.updateFilterDetailsSummaryText(open);
  }

  /**
   * Patches the form with the last submitted filter values.
   */
  private patchFilterForm(): void {
    if (!this.filterForm) {
      return;
    }

    this.form.patchValue(this.filterForm.formData as TFinesAccHistoryAndNotesFilterFormValue, {
      emitEvent: false,
    });
    this.updateDateToValidators();
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
        this.updateFilterDetailsSummaryText(detailsElement.open);
        this.filterOpenChange.emit(detailsElement.open);
      });
    }

    this.setFilterDetailsOpen(this.filterOpen);
  }

  /**
   * Applies externally held filter state when the parent redraws the tab.
   *
   * @param changes - Input property changes.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterForm'] && this.form) {
      this.patchFilterForm();
    }

    if (changes['filterOpen']) {
      this.setFilterDetailsOpen(this.filterOpen);
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
  public getCategoryControl(categoryValue: string): FormControl<boolean> {
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
    this.patchFilterForm();
    this.setupDateFromValidatorListener();
    this.setInitialErrorMessages();
    super.ngOnInit();
  }

  /**
   * Keeps the details panel open and prevents native form navigation when filtering.
   *
   * @param event - The filter submit event.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.setFilterDetailsOpen(true);
    this.filterOpenChange.emit(true);
    super.handleFormSubmit(event);
  }
}
