import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
  GovukTableComponent,
  GovukTableHeadingComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { takeUntil } from 'rxjs';
import {
  atLeastOneBusinessUnitSelectedRecordValidator,
  businessUnitSelectionRootMirrorValidator,
} from '../../../validators/business-unit-selection.validator';
import { IFinesReportsSelectBusinessUnitRow } from './interfaces/fines-reports-select-business-unit-row.interface';
import { IFinesReportsSelectBusinessUnitsFormState } from '../interfaces/fines-reports-select-business-units-form-state.interface';
import { FINES_REPORTS_SELECT_BUSINESS_UNITS_FIELD_ERRORS } from '../constants/fines-reports-select-business-units-field-errors.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../../routing/constants/fines-reports-routing-titles.constant';

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
    GovukErrorSummaryComponent,
    GovukHeadingWithCaptionComponent,
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

  protected override fieldErrors = FINES_REPORTS_SELECT_BUSINESS_UNITS_FIELD_ERRORS;

  protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesReportsSelectBusinessUnitsFormState>>();

  /**
   * Business units available for the selected operational report.
   */
  @Input({ required: true }) public businessUnits!: IOpalFinesBusinessUnit[];

  /**
   * Report-specific heading resolved by the parent route component.
   */
  @Input({ required: true }) public reportHeading!: string;

  /**
   * Previously selected business unit ids to restore when returning from the warning screen.
   */
  @Input() public initialSelectedBusinessUnitIds: number[] = [];

  /**
   * Page heading displayed above the business unit form.
   */
  public readonly pageHeading = FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits;

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
   * Error messages shown against the business-unit form controls.
   */
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  /**
   * Form control backing the master select-all checkbox.
   */
  public allBusinessUnitsControl = new FormControl(false, { nonNullable: true });

  /**
   * Table rows containing each business unit and its checkbox metadata.
   */
  public businessUnitRows: IFinesReportsSelectBusinessUnitRow[] = [];

  /**
   * Creates checkbox form controls keyed by business unit id and the row metadata used to render them.
   *
   * @returns A form record containing one unchecked control for each business unit.
   */
  private createBusinessUnitCheckboxControls(): FormRecord<FormControl<boolean>> {
    const controls: Record<string, FormControl<boolean>> = {};

    this.businessUnitRows = this.businessUnits.map((businessUnit) => {
      const businessUnitId = businessUnit.business_unit_id.toString();
      const control = new FormControl(this.initialSelectedBusinessUnitIds.includes(businessUnit.business_unit_id), {
        nonNullable: true,
      });

      controls[businessUnitId] = control;

      return {
        businessUnit,
        control,
        inputId: `business-unit-${businessUnitId}`,
        inputName: businessUnitId,
      };
    });

    return new FormRecord<FormControl<boolean>>(controls, {
      validators: atLeastOneBusinessUnitSelectedRecordValidator,
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

    this.refreshFormValidation(record);
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
   * Refreshes the business unit record and parent form validation state.
   *
   * @param record - The business unit form record to validate.
   */
  private refreshFormValidation(record: FormRecord<FormControl<boolean>>): void {
    record.updateValueAndValidity({ emitEvent: false });
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Creates the reactive form and wires checkbox changes into component state.
   */
  private initialiseBusinessUnitForm(): void {
    const record =
      this.businessUnits.length === 1
        ? new FormRecord<FormControl<boolean>>({})
        : this.createBusinessUnitCheckboxControls();
    this.allBusinessUnitsControl = new FormControl(false, { nonNullable: true });

    this.form = new FormGroup(
      {
        [this.BUSINESS_UNITS_CTRL]: record,
        [this.ALL_BUSINESS_UNITS_CTRL]: this.allBusinessUnitsControl,
      },
      { validators: businessUnitSelectionRootMirrorValidator(this.BUSINESS_UNITS_CTRL) },
    );

    this.refreshFormValidation(record);
    this.updateAllBusinessUnitsControlFromRecord(record);
    record.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.refreshFormValidation(record);
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
