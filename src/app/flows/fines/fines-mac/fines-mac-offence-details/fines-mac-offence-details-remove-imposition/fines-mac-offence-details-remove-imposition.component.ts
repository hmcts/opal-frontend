import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { forkJoin, Observable, tap } from 'rxjs';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { AbstractFormArrayRemovalComponent } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES } from '../constants/fines-mac-offence-details-imposition-field-names.constant';
import { FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS } from './constants/fines-mac-offence-details-remove-imposition-defaults';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../constants/fines-mac-offence-details-draft-state.constant';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';
import { IAbstractFormArrayControls } from '@components/abstract/interfaces/abstract-form-array-controls.interface';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { GovukTableBodyRowDataComponent } from '@components/govuk/govuk-table/govuk-table-body-row/govuk-table-body-row-data/govuk-table-body-row-data.component';
import { GovukTableBodyRowComponent } from '@components/govuk/govuk-table/govuk-table-body-row/govuk-table-body-row.component';
import { GovukTableHeadingComponent } from '@components/govuk/govuk-table/govuk-table-heading/govuk-table-heading.component';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';

@Component({
  selector: 'app-fines-mac-offence-details-remove-imposition',
  standalone: true,
  imports: [
    CommonModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
  ],
  templateUrl: './fines-mac-offence-details-remove-imposition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveImpositionComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit, OnDestroy
{
  private readonly finesService = inject(FinesService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  public resultCode!: IOpalFinesResultsRefData;
  private readonly resultCodeData$: Observable<IOpalFinesResultsRefData> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(tap((response) => (this.resultCode = response)));
  public majorCreditors!: IOpalFinesMajorCreditorRefData;
  private readonly majorCreditorData$: Observable<IOpalFinesMajorCreditorRefData> = this.opalFinesService
    .getMajorCreditors(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(tap((response) => (this.majorCreditors = response)));
  public groupResultCodeAndMajorCreditorData$ = forkJoin({
    resultCodeData: this.resultCodeData$,
    majorCreditorData: this.majorCreditorData$,
  });
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
  protected draftOffenceDetailsState = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;

  public imposition = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault;
  public creditor!: string;
  public defaultCreditor: string = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault;
  public majorCreditor!: string;
  public minorCreditor!: string;
  public amountImposedString = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
  public amountPaidString = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
  public balanceString = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;

  /**
   * Converts a number value to a monetary string representation.
   *
   * @param value - The number value to be converted.
   * @returns The monetary string representation of the given value.
   */
  private updateMonetaryString(value: number): string {
    return this.utilsService.convertToMonetaryString(value);
  }

  /**
   * Removes a minor creditor from the array at the specified index and updates the imposition positions
   * for the remaining items in the array.
   *
   * @param minorCreditorArray - The array of minor creditor forms.
   * @param splicedIndex - The index at which to remove the minor creditor.
   * @returns The updated array of minor creditor forms.
   */
  private removeMinorCreditorAndUpdateIds(
    minorCreditorArray: IFinesMacOffenceDetailsMinorCreditorForm[],
    splicedIndex: number,
  ): void {
    // Splice the array at the specified index
    minorCreditorArray.splice(splicedIndex, 1);

    // Update imposition position for the remaining items
    for (let i = splicedIndex; i < minorCreditorArray.length; i++) {
      const currentItem = minorCreditorArray[i];

      currentItem.formData.fm_offence_details_imposition_position = i;
    }
  }

  /**
   * Decrements the imposition position by 1 for minor creditors after the specified index.
   *
   * @param minorCreditorArray - The array of minor creditor forms.
   * @param dropIndex - The index after which to decrement the imposition positions.
   * @returns The updated array of minor creditor forms.
   */
  private dropMinorCreditorImpositionPosition(
    minorCreditorArray: IFinesMacOffenceDetailsMinorCreditorForm[],
    dropIndex: number,
  ): void {
    const minorCreditors = minorCreditorArray.filter(
      (x) => x.formData.fm_offence_details_imposition_position! >= dropIndex,
    );
    minorCreditors.forEach((minorCreditor) => (minorCreditor.formData.fm_offence_details_imposition_position! -= 1));
  }

  /**
   * Sets the details of the major creditor based on the provided major creditor ID.
   * If the ID is valid and a matching major creditor is found, it retrieves and sets
   * the pretty name of the major creditor.
   *
   * @param majorCreditorId - The ID of the major creditor to be set. Can be null.
   */
  private setMajorCreditorDetails(majorCreditorId: number | null): void {
    if (majorCreditorId) {
      const majorCreditor = this.majorCreditors.refData.find((item) => item.major_creditor_id === majorCreditorId);
      if (majorCreditor) {
        this.majorCreditor = this.opalFinesService.getMajorCreditorPrettyName(majorCreditor);
      }
    }
  }

  /**
   * Sets the details of a minor creditor based on the provided row index.
   *
   * This method searches through the offence details draft state for a minor creditor
   * whose imposition position matches the given row index. If a matching minor creditor
   * is found, it sets the `minorCreditor` property to the creditor's full name if the
   * creditor type is 'individual', or to the company name if the creditor type is 'company'.
   *
   * @param rowIndex - The index of the row to find the minor creditor details for.
   */
  private setMinorCreditorDetails(rowIndex: number): void {
    const minorCreditors =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData;
    if (minorCreditors) {
      const minorCreditor = minorCreditors.find(
        (item) => item.formData.fm_offence_details_imposition_position === rowIndex,
      );
      if (minorCreditor) {
        this.minorCreditor =
          minorCreditor.formData.fm_offence_details_minor_creditor_creditor_type === 'individual'
            ? `${minorCreditor.formData.fm_offence_details_minor_creditor_forenames} ${minorCreditor.formData.fm_offence_details_minor_creditor_surname}`.trim()
            : minorCreditor.formData.fm_offence_details_minor_creditor_company_name!;
      }
    }
  }

  /**
   * Sets the monetary strings for the imposed amount, paid amount, and balance.
   * Converts the numerical values to formatted strings using `updateMonetaryString` method.
   * If the values are not greater than zero, it sets them to a default string value.
   *
   * @param amountImposed - The amount imposed as a number.
   * @param amountPaid - The amount paid as a number.
   * @param balance - The balance amount as a number.
   * @returns void
   */
  private setMonetaryStrings(amountImposed: number, amountPaid: number, balance: number): void {
    this.amountImposedString =
      amountImposed > 0
        ? this.updateMonetaryString(amountImposed)
        : FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
    this.amountPaidString =
      amountPaid > 0
        ? this.updateMonetaryString(amountPaid)
        : FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
    this.balanceString =
      balance > 0
        ? this.updateMonetaryString(balance)
        : FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
  }

  /**
   * Returns the default creditor based on the provided imposition creditor code.
   *
   * @param impositionCreditor - The code representing the imposition creditor.
   * @returns The default creditor string corresponding to the provided imposition creditor code.
   *          - 'CF' returns the central fund default.
   *          - 'CPS' returns the crown prosecution service default.
   *          - Any other value returns the string default.
   */
  private getDefaultCreditor(impositionCreditor: string): string {
    switch (impositionCreditor) {
      case 'CF':
        return FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.centralFundDefault;
      case 'CPS':
        return FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.crownProsecutionServiceDefault;
      default:
        return FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault;
    }
  }

  /**
   * Retrieves the imposition to be removed based on the provided parameters.
   *
   * @param rowIndex - The index of the row in the form array.
   * @param formArray - The form array containing the controls.
   * @param formArrayControls - The array of form array controls.
   */
  public getImpositionToBeRemoved(
    rowIndex: number,
    formArray: FormArray,
    formArrayControls: IAbstractFormArrayControls[],
  ): void {
    const formArrayControl = formArrayControls[rowIndex];

    const getControlValue = (controlName: string, defaultValue: string | number | null) =>
      this.getFormArrayControlValue(formArray, controlName, rowIndex, defaultValue);

    const resultCode = getControlValue(
      formArrayControl[`fm_offence_details_result_id`].controlName,
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.nullDefault,
    );

    this.creditor = getControlValue(
      formArrayControl[`fm_offence_details_creditor`].controlName,
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault,
    ) as string;

    this.setMajorCreditorDetails(
      getControlValue(formArrayControl[`fm_offence_details_major_creditor_id`].controlName, null) as number | null,
    );

    this.setMinorCreditorDetails(rowIndex);

    const amountImposed = getControlValue(
      formArrayControl[`fm_offence_details_amount_imposed`].controlName,
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault,
    ) as number;
    const amountPaid = getControlValue(formArrayControl[`fm_offence_details_amount_paid`].controlName, 0) as number;
    const balance = amountImposed - amountPaid;

    this.setMonetaryStrings(amountImposed, amountPaid, balance);

    if (!resultCode) {
      this.imposition = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault;
      return;
    }

    const result = this.resultCode.refData.find((item) => item.result_id === resultCode);
    if (result) {
      this.imposition = this.opalFinesService.getResultPrettyName(result);
      this.defaultCreditor = this.getDefaultCreditor(result.imposition_creditor);
    }
  }

  /**
   * Confirms the removal of an imposition from the offence details.
   *
   * This method performs the following actions:
   * 1. Removes the control from the form array and renumbers the remaining controls.
   * 2. Updates the imposition positions in the child form data if it exists.
   * 3. Updates the offence details impositions in the form data.
   * 4. Handles routing to the add offence path.
   *
   * @param rowIndex - The index of the row to be removed.
   * @param formArray - The form array containing the impositions.
   */
  public confirmRemoval(rowIndex: number, formArray: FormArray): void {
    const { formData, childFormData } = this.draftOffenceDetailsState.offenceDetailsDraft[0];

    this.removeControlAndRenumber(
      formArray,
      rowIndex,
      FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES.fieldNames,
      FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES.dynamicFieldPrefix,
    );

    if (childFormData) {
      const index = childFormData.findIndex(
        (childFormData) => childFormData.formData.fm_offence_details_imposition_position === rowIndex,
      );
      if (index >= 0) {
        this.removeMinorCreditorAndUpdateIds(childFormData, index);
      } else {
        this.dropMinorCreditorImpositionPosition(childFormData, rowIndex);
      }
    }

    formData.fm_offence_details_impositions = formArray.value;

    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public ngOnDestroy(): void {
    this.draftOffenceDetailsState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
  }

  public ngOnInit(): void {
    this.finesMacOffenceDetailsService.offenceCodeMessage = '';
  }
}
