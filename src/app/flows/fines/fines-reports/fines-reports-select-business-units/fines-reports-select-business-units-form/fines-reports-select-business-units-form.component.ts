import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
  GovukTableComponent,
  GovukTableHeadingComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { takeUntil } from 'rxjs';

interface IFinesReportsSelectBusinessUnitRow {
  businessUnit: IOpalFinesBusinessUnit;
  control: FormControl<boolean>;
  inputId: string;
  inputName: string;
}

@Component({
  selector: 'app-fines-reports-select-business-units-form',
  imports: [
    ReactiveFormsModule,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
    GovukCheckboxesItemComponent,
    GovukCancelLinkComponent,
    GovukButtonDirective,
  ],
  templateUrl: './fines-reports-select-business-units-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSelectBusinessUnitsFormComponent extends AbstractFormBaseComponent implements OnInit {
  /**
   * Form control name for the individual business unit checkbox record.
   */
  private readonly BUSINESS_UNITS_CTRL = 'fines_reports_select_business_unit_ids';

  /**
   * Form control name for the master select-all business unit checkbox.
   */
  private readonly ALL_BUSINESS_UNITS_CTRL = 'fines_reports_select_business_unit_ids_select_all';

  /**
   * Signal storing the latest checked state for each business unit id.
   */
  private readonly businessUnitSelections = signal<Record<number, boolean>>({});

  /**
   * Business units available for the selected operational report.
   */
  @Input({ required: true }) public businessUnits!: IOpalFinesBusinessUnit[];

  /**
   * Emits when the user selects the cancel link.
   */
  @Output() public cancelSelection = new EventEmitter<void>();

  /**
   * Id used by the master business unit checkbox.
   */
  public readonly allBusinessUnitsInputId = this.BUSINESS_UNITS_CTRL;

  /**
   * Name used by the master business unit checkbox.
   */
  public readonly allBusinessUnitsInputName = this.ALL_BUSINESS_UNITS_CTRL;

  /**
   * Form control backing the master select-all checkbox.
   */
  public allBusinessUnitsControl = new FormControl(false, { nonNullable: true });

  /**
   * Table rows containing each business unit and its checkbox metadata.
   */
  public businessUnitRows: IFinesReportsSelectBusinessUnitRow[] = [];

  /**
   * Selected business unit ids derived from the checkbox controls.
   */
  public readonly selectedBusinessUnitIds = computed(() => {
    if (this.businessUnits.length === 1) {
      return [this.businessUnits[0].business_unit_id];
    }

    const selections = this.businessUnitSelections();

    return this.businessUnits
      .filter((businessUnit) => selections[businessUnit.business_unit_id])
      .map((businessUnit) => businessUnit.business_unit_id);
  });

  /**
   * Number of currently selected business units.
   */
  public readonly selectedCount = computed(() => this.selectedBusinessUnitIds().length);

  /**
   * Whether every available business unit is selected.
   */
  public readonly isAllSelected = computed(
    () => this.businessUnits.length > 0 && this.selectedCount() === this.businessUnits.length,
  );

  /**
   * Creates checkbox form controls keyed by business unit id.
   *
   * @returns A form record containing one unchecked control for each business unit.
   */
  private createBusinessUnitControlsRecord(): FormRecord<FormControl<boolean>> {
    const controls = this.businessUnits.reduce<Record<string, FormControl<boolean>>>((acc, businessUnit) => {
      acc[businessUnit.business_unit_id.toString()] = new FormControl(false, { nonNullable: true });
      return acc;
    }, {});

    return new FormRecord<FormControl<boolean>>(controls);
  }

  /**
   * Builds the row view model used by the template.
   *
   * @param record - The business unit form record that owns each row control.
   */
  private buildBusinessUnitRows(record: FormRecord<FormControl<boolean>>): void {
    this.businessUnitRows = this.businessUnits.map((businessUnit) => {
      const businessUnitId = businessUnit.business_unit_id.toString();

      return {
        businessUnit,
        control: record.get(businessUnitId) as FormControl<boolean>,
        inputId: `business-unit-${businessUnitId}`,
        inputName: businessUnitId,
      };
    });
  }

  /**
   * Updates every business unit checkbox to match the master checkbox value.
   *
   * @param record - The business unit form record containing the child checkbox controls.
   * @param selected - Whether all business units should be selected.
   */
  private setAllBusinessUnitControls(record: FormRecord<FormControl<boolean>>, selected: boolean): void {
    for (const control of Object.values(record.controls)) {
      control.setValue(selected, { emitEvent: false });
    }

    this.refreshBusinessUnitSelections(record);
    this.updateAllBusinessUnitsControlFromRecord(record);
  }

  /**
   * Updates the master checkbox from the current child checkbox state.
   *
   * @param record - The business unit form record containing the child checkbox controls.
   */
  private updateAllBusinessUnitsControlFromRecord(record: FormRecord<FormControl<boolean>>): void {
    const allSelected =
      this.businessUnits.length > 1 && Object.values(record.controls).every((control) => control.value);
    this.allBusinessUnitsControl.setValue(allSelected, { emitEvent: false });
  }

  /**
   * Synchronises the selection signal with the current form record values.
   *
   * @param record - The business unit form record to read from.
   */
  private refreshBusinessUnitSelections(record: FormRecord<FormControl<boolean>>): void {
    this.businessUnitSelections.set(
      this.objectFromFormRecord<boolean, boolean, number>(record, {
        mapKey: Number,
        mapValue: (value) => !!value,
      }),
    );
  }

  /**
   * Creates the reactive form and wires checkbox changes into component state.
   */
  private initialiseBusinessUnitForm(): void {
    const record =
      this.businessUnits.length > 1
        ? this.createBusinessUnitControlsRecord()
        : new FormRecord<FormControl<boolean>>({});
    this.allBusinessUnitsControl = new FormControl(false, { nonNullable: true });

    this.form = new FormGroup({
      [this.BUSINESS_UNITS_CTRL]: record,
      [this.ALL_BUSINESS_UNITS_CTRL]: this.allBusinessUnitsControl,
    });

    if (this.businessUnits.length > 1) {
      this.buildBusinessUnitRows(record);
    }

    this.refreshBusinessUnitSelections(record);
    record.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.refreshBusinessUnitSelections(record);
      this.updateAllBusinessUnitsControlFromRecord(record);
    });
    this.allBusinessUnitsControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((selected) => {
      this.setAllBusinessUnitControls(record, selected);
    });
  }

  /**
   * Emits the cancel event to the parent page component.
   */
  public handleCancel(): void {
    this.cancelSelection.emit();
  }

  /**
   * Initialises the select business units form using the resolved business units.
   */
  public override ngOnInit(): void {
    this.initialiseBusinessUnitForm();
    super.ngOnInit();
  }
}
