import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { Observable, tap } from 'rxjs';
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

@Component({
  selector: 'app-fines-mac-offence-details-remove-imposition',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, GovukCancelLinkComponent, GovukTableComponent],
  templateUrl: './fines-mac-offence-details-remove-imposition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveImpositionComponent
  extends AbstractFormArrayRemovalComponent
  implements OnDestroy
{
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  public resultCode!: IOpalFinesResultsRefData;
  public resultCodeData$: Observable<IOpalFinesResultsRefData> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(tap((response) => (this.resultCode = response)));
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
  protected draftOffenceDetailsState = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;

  public imposition = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault;
  public creditor = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault;
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
   * Updates the imposition positions of offence details after an item has been spliced from the array.
   *
   * @param offenceDetailsArray - The array of offence details.
   * @param splicedIndex - The index at which the item was spliced.
   * @returns The updated array of offence details with corrected imposition positions.
   */
  private updateImpositionPositionsAfterSplice(
    offenceDetailsArray: IFinesMacOffenceDetailsMinorCreditorForm[],
    splicedIndex: number,
  ): IFinesMacOffenceDetailsMinorCreditorForm[] {
    // Splice the array at the specified index
    offenceDetailsArray.splice(splicedIndex, 1);

    // Update imposition positions for the remaining items
    for (let i = splicedIndex; i < offenceDetailsArray.length; i++) {
      const currentItem = offenceDetailsArray[i];

      // Check if the position is not null before updating
      if (currentItem.formData.fm_offence_details_imposition_position !== null) {
        currentItem.formData.fm_offence_details_imposition_position = i;
      }
    }

    return offenceDetailsArray;
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

    const resultCode = this.getFormArrayControlValue(
      formArray,
      formArrayControl[`fm_offence_details_result_code`].controlName,
      rowIndex,
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.nullDefault,
    );

    this.creditor = this.getFormArrayControlValue(
      formArray,
      formArrayControl[`fm_offence_details_creditor`].controlName,
      rowIndex,
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.stringDefault,
    ) as string;

    const amountImposed = this.getFormArrayControlValue(
      formArray,
      formArrayControl[`fm_offence_details_amount_imposed`].controlName,
      rowIndex,
      FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault,
    ) as number;

    const amountPaid = this.getFormArrayControlValue(
      formArray,
      formArrayControl[`fm_offence_details_amount_paid`].controlName,
      rowIndex,
      0,
    ) as number;

    const balance = amountImposed - amountPaid;

    if (amountImposed > 0) {
      this.amountImposedString = this.updateMonetaryString(amountImposed);
    } else {
      this.amountImposedString = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
    }

    if (amountPaid > 0) {
      this.amountPaidString = this.updateMonetaryString(amountPaid);
    } else {
      this.amountPaidString = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
    }

    if (balance > 0) {
      this.balanceString = this.updateMonetaryString(balance);
    } else {
      this.balanceString = FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_DEFAULTS.numberDefault;
    }

    if (!resultCode) {
      this.imposition = 'Not provided';
    } else {
      const items = this.resultCode.refData.filter((item) => item.result_id === resultCode);
      this.imposition = this.opalFinesService.getResultPrettyName(items[0]);
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
      const index = childFormData.findIndex((x) => x.formData.fm_offence_details_imposition_position === rowIndex);
      this.updateImpositionPositionsAfterSplice(childFormData, index);
    }

    formData.fm_offence_details_impositions = formArray.value;

    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public ngOnDestroy(): void {
    this.draftOffenceDetailsState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
  }
}
