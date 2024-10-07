import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes';
import { Observable, first, map } from 'rxjs';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FormArray } from '@angular/forms';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';

@Component({
  selector: 'app-fines-mac-offence-details-remove-imposition',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent, GovukTableComponent],
  templateUrl: './fines-mac-offence-details-remove-imposition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveImpositionComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
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
  public amountImposedString!: string;
  public amountPaidString = '£0.00';
  public balanceString!: string;

  private getControlValue(formArray: FormArray, controlName: string, rowIndex: number): any {
    return formArray.controls[rowIndex].get(controlName)?.value || 'Not provided';
  }

  private updateMonetaryString(value: number): string {
    return this.utilsService.convertToMonetaryString(value.toString());
  }

  private getImpositionToBeRemoved(): void {
    const { rowIndex, formArray, formArrayControls } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition!;
    const formArrayControl = formArrayControls[rowIndex];

    const resultCode = this.getControlValue(
      formArray,
      formArrayControl[`fm_offence_details_result_code`].controlName,
      rowIndex,
    );
    if (!resultCode) return;

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

    this.creditor = this.getControlValue(
      formArray,
      formArrayControl[`fm_offence_details_creditor`].controlName,
      rowIndex,
    );
    const amountImposed = +this.getControlValue(
      formArray,
      formArrayControl[`fm_offence_details_amount_imposed`].controlName,
      rowIndex,
    );
    const amountPaid = this.getControlValue(
      formArray,
      formArrayControl[`fm_offence_details_amount_paid`].controlName,
      rowIndex,
    );

    this.amountImposedString = this.updateMonetaryString(amountImposed);

    // Check if amountPaid is a valid number before processing
    if (amountPaid !== null && amountPaid !== undefined && !isNaN(amountPaid)) {
      this.amountPaidString = this.updateMonetaryString(+amountPaid);

      // Calculate balance only if both amountImposed and amountPaid are valid
      if (amountImposed) {
        const balance = amountImposed - +amountPaid;
        this.balanceString = this.updateMonetaryString(balance);
      }
    } else {
      this.balanceString = this.updateMonetaryString(amountImposed); // If no amountPaid, balance is just amountImposed
    }
  }

  public confirmRemoval(): void {
    const { rowIndex, formArrayControls } =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition!;
    const { offenceDetailsDraft } = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;

    this.removeAndReindexImpositions(offenceDetailsDraft[0].formData, rowIndex);
    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition!.formArrayControls =
      formArrayControls.slice(rowIndex, 1);
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public removeAndReindexImpositions(formData: any, removeIndex: number): void {
    const impositions = formData.fm_offence_details_impositions;

    // Remove the item from the array at the given index
    impositions.splice(removeIndex, 1);

    // Reindex the remaining impositions
    this.reindexImpositions(impositions, removeIndex);
  }

  private reindexImpositions(impositions: any[], startIndex: number): void {
    for (let index = startIndex; index < impositions.length; index++) {
      const imposition = impositions[index]; // Get the current imposition

      // Update field names for the current index
      this.updateImpositionKeys(imposition, index);
    }
  }

  private updateImpositionKeys(imposition: any, index: number): void {
    ['amount_imposed', 'amount_paid', 'creditor', 'needs_creditor', 'result_code'].forEach((field) => {
      const currentKey = `fm_offence_details_${field}_${index + 1}`;
      const newKey = `fm_offence_details_${field}_${index}`;

      // If the current key exists, rename it to the new key
      if (imposition[currentKey] !== undefined) {
        imposition[newKey] = imposition[currentKey];
        delete imposition[currentKey]; // Clean up the old key
      }
    });
  }

  public handleRoute(route: string, event?: Event): void {
    if (event) event.preventDefault();
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }

  public ngOnInit(): void {
    this.getImpositionToBeRemoved();
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition = null;
  }
}
