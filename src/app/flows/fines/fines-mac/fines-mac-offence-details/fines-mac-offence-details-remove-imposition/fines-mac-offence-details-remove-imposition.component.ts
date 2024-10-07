import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes';
import { Observable, first, map } from 'rxjs';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { AbstractFormArrayRemovalComponent } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES } from '../constants/fines-mac-offence-details-imposition-field-names';

@Component({
  selector: 'app-fines-mac-offence-details-remove-imposition',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent, GovukTableComponent],
  templateUrl: './fines-mac-offence-details-remove-imposition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveImpositionComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit
{
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);
  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  public readonly resultCodeData$: Observable<IOpalFinesResultsRefData> = this.opalFinesService.getResults(
    this.resultCodeArray,
  );
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  public imposition: string = 'Not provided';
  public creditor: string = 'Not provided';
  public amountImposedString = '£0.00';
  public amountPaidString = '£0.00';
  public balanceString = '£0.00';

  private updateMonetaryString(value: number): string {
    return this.utilsService.convertToMonetaryString(value);
  }

  private getImpositionToBeRemoved(): void {
    const { rowIndex, formArray, formArrayControls } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition!;
    const formArrayControl = formArrayControls[rowIndex];

    const resultCode = this.getFormArrayControlValue<string | null>(
      formArray,
      formArrayControl[`fm_offence_details_result_code`].controlName,
      rowIndex,
      null,
    );

    this.creditor = this.getFormArrayControlValue<string>(
      formArray,
      formArrayControl[`fm_offence_details_creditor`].controlName,
      rowIndex,
      'Not provided',
    );

    const amountImposed = this.getFormArrayControlValue<number>(
      formArray,
      formArrayControl[`fm_offence_details_amount_imposed`].controlName,
      rowIndex,
      0,
    );

    const amountPaid = this.getFormArrayControlValue<number>(
      formArray,
      formArrayControl[`fm_offence_details_amount_paid`].controlName,
      rowIndex,
      0,
    );

    const balance = amountImposed - amountPaid;

    if (amountImposed > 0) {
      this.amountImposedString = this.updateMonetaryString(amountImposed);
    }

    if (amountPaid > 0) {
      this.amountPaidString = this.updateMonetaryString(amountPaid);
    }

    if (balance > 0) {
      this.balanceString = this.updateMonetaryString(balance);
    }

    if (!resultCode) {
      this.imposition = 'Not provided';
    } else {
      this.resultCodeData$
        .pipe(
          map((response) => response.refData.filter((item) => item.result_id === resultCode)),
          first(),
        )
        .subscribe((items) => {
          if (items.length > 0) {
            this.imposition = this.opalFinesService.getResultPrettyName(items[0]);
          }
        });
    }
  }

  /**
   * Confirms the removal of an imposition from the offence details.
   * Removes the control from the form array, updates the form data,
   * and handles the route navigation.
   */
  public confirmRemoval(): void {
    const { rowIndex, formArray } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition!;
    const { formData } = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0];

    this.removeControlAndRenumber(
      formArray,
      rowIndex,
      FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES.fieldNames,
      FINES_MAC_OFFENCE_DETAILS_IMPOSITION_FIELD_NAMES.dynamicFieldPrefix,
    );

    formData.fm_offence_details_impositions = formArray.value;

    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public ngOnInit(): void {
    this.getImpositionToBeRemoved();
  }
}
