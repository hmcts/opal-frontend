import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { CommonModule } from '@angular/common';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { GovukHeadingWithCaptionComponent } from '@components/govuk/govuk-heading-with-caption/govuk-heading-with-caption.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListRowActionsComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-actions.component';
import { Observable, forkJoin, map } from 'rxjs';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary/fines-mac-offence-details-review-summary.component';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';

@Component({
  selector: 'app-fines-mac-offence-details-review',
  standalone: true,
  imports: [
    CommonModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTableComponent,
    MojTicketPanelComponent,
    GovukHeadingWithCaptionComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryListRowActionsComponent,
    FinesMacOffenceDetailsReviewSummaryComponent,
  ],
  templateUrl: './fines-mac-offence-details-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./fines-mac-offence-details-review.component.scss'],
})
export class FinesMacOffenceDetailsReviewComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);

  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  private readonly impositionRefData$: Observable<IOpalFinesResultsRefData> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(map((response: IOpalFinesResultsRefData) => response));
  private readonly majorCreditorRefData$: Observable<IOpalFinesMajorCreditorRefData> = this.opalFinesService
    .getMajorCreditors(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(map((response: IOpalFinesMajorCreditorRefData) => response));
  public readonly referenceData$ = forkJoin({
    impositionRefData: this.impositionRefData$,
    majorCreditorRefData: this.majorCreditorRefData$,
  });

  public offencesImpositions!: IFinesMacOffenceDetailsForm[];

  protected readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  private removeIndexFromImpositionKeys(forms: IFinesMacOffenceDetailsForm[]): IFinesMacOffenceDetailsForm[] {
    return forms.map((form) => ({
      formData: {
        ...form.formData,
        fm_offence_details_impositions: form.formData.fm_offence_details_impositions.map((imposition: any) => {
          const cleanedImposition: any = {};
          Object.keys(imposition).forEach((key) => {
            // Use regex to remove the _{{index}} from the key
            const newKey = key.replace(/_\d+$/, '');
            cleanedImposition[newKey] = imposition[key];
          });
          return cleanedImposition;
        }),
      },
      nestedFlow: form.nestedFlow,
      status: form.status,
    }));
  }

  // private getSummaryData(): Observable<IFinesMacOffenceDetailsReview> {
  //   let totalAmountImposed = 0;
  //   let totalAmountPaid = 0;
  //   let totalBalanceRemaining = 0;

  //   // Use forkJoin if you need to wait for multiple async calls for all offences
  //   return forkJoin(
  //     this.offencesImpositions.map((offence) =>
  //       this.opalFinesService.getOffenceByCjsCode(offence.formData.fm_offence_details_offence_code!).pipe(
  //         map((offenceRefData: IOpalFinesOffencesRefData) => {
  //           let amountImposedTotal = 0;
  //           let amountPaidTotal = 0;
  //           let balanceRemainingTotal = 0;

  //           const impositionData = offence.formData.fm_offence_details_impositions.map((imposition) => {
  //             amountImposedTotal += imposition.fm_offence_details_amount_imposed ?? 0;
  //             amountPaidTotal += imposition.fm_offence_details_amount_paid ?? 0;
  //             balanceRemainingTotal += imposition.fm_offence_details_balance_remaining ?? 0;

  //             return {
  //               impositionDescription: this.getResultCodeDescription(
  //                 this.resultCodeData,
  //                 'fm_offence_details_result_code',
  //               ),
  //               creditor: imposition.fm_offence_details_creditor ?? 'HM Courts & Tribunals Service (HMCTS)',
  //               amountImposed: this.utilsService.convertToMonetaryString(
  //                 imposition.fm_offence_details_amount_imposed ?? 0,
  //               ),
  //               amountPaid: this.utilsService.convertToMonetaryString(imposition.fm_offence_details_amount_paid ?? 0),
  //               balanceRemaining: this.utilsService.convertToMonetaryString(
  //                 imposition.fm_offence_details_balance_remaining ?? 0,
  //               ),
  //             } as IFinesMacOffenceDetailsReviewImpositionData;
  //           });

  //           totalAmountImposed += amountImposedTotal;
  //           totalAmountPaid += amountPaidTotal;
  //           totalBalanceRemaining += balanceRemainingTotal;

  //           return {
  //             id: offence.formData.fm_offence_details_index,
  //             dateOfSentence: this.dateService.toFormat(
  //               this.dateService.getFromFormat(offence.formData.fm_offence_details_date_of_offence!, 'dd/MM/yyyy'),
  //               'dd MMM yyyy',
  //             ),
  //             offenceCode: offenceRefData.refData[0].get_cjs_code,
  //             offenceDescription: offenceRefData.refData[0].offence_title,
  //             impositionData,
  //             amountImposedTotal: this.utilsService.convertToMonetaryString(amountImposedTotal),
  //             amountPaidTotal: this.utilsService.convertToMonetaryString(amountPaidTotal),
  //             balanceRemainingTotal: this.utilsService.convertToMonetaryString(balanceRemainingTotal),
  //           } as IFinesMacOffenceDetailsReviewOffenceData;
  //         }),
  //       ),
  //     ),
  //   ).pipe(
  //     map((offenceData: IFinesMacOffenceDetailsReviewOffenceData[]) => {
  //       return {
  //         offenceData,
  //         totalAmountImposed: this.utilsService.convertToMonetaryString(totalAmountImposed),
  //         totalAmountPaid: this.utilsService.convertToMonetaryString(totalAmountPaid),
  //         totalBalanceRemaining: this.utilsService.convertToMonetaryString(totalBalanceRemaining),
  //       } as IFinesMacOffenceDetailsReview;
  //     }),
  //   );
  // }

  private getOffencesImpositions(): void {
    this.offencesImpositions = this.removeIndexFromImpositionKeys(this.finesService.finesMacState.offenceDetails);
  }

  // /**
  //  * Calculates the total value of a specific field in the offence details impositions for each offence.
  //  *
  //  * @param offences - An array of `IFinesMacOffenceDetailsForm` objects representing the offences.
  //  * @param fieldName - The name of the field to calculate the total for.
  //  * @returns A string representing the total value converted to a monetary string.
  //  */
  // public calculateOffencesTotal(
  //   offences: IFinesMacOffenceDetailsForm[],
  //   fieldName: keyof IFinesMacOffenceDetailsImpositionsState,
  // ): string {
  //   const total = offences.reduce((offenceTotal, offence) => {
  //     const impositionTotal = offence.formData.fm_offence_details_impositions.reduce((impositionTotal, imposition) => {
  //       return impositionTotal + parseFloat(imposition[fieldName] as string);
  //     }, 0);

  //     return offenceTotal + impositionTotal;
  //   }, 0);

  //   return this.utilsService.convertToMonetaryString(total);
  // }

  // /**
  //  * Calculates the total value of a specific field in an array of `IFinesMacOffenceDetailsImpositionsState` objects.
  //  *
  //  * @param impositions - An array of `IFinesMacOffenceDetailsImpositionsState` objects.
  //  * @param fieldName - The name of the field to calculate the total for.
  //  * @returns The total value of the specified field as a formatted monetary string.
  //  */
  // public calculateImpositionTotals(
  //   impositions: IFinesMacOffenceDetailsImpositionsState[],
  //   fieldName: keyof IFinesMacOffenceDetailsImpositionsState,
  // ): string {
  //   const total = impositions.reduce((total, imposition) => {
  //     return total + parseFloat(imposition[fieldName] as string);
  //   }, 0);
  //   return this.utilsService.convertToMonetaryString(total);
  // }

  // /**
  //  * Retrieves the description of a result code from the provided reference data.
  //  * @param resultCodes - The reference data containing the result codes.
  //  * @param resultCode - The result code for which to retrieve the description.
  //  * @returns The description of the specified result code.
  //  */
  // public getResultCodeDescription(resultCodes: IOpalFinesResultsRefData, resultCode: string): string {
  //   return resultCodes.refData.filter((result) => result.result_id === resultCode)[0].result_title;
  // }

  // /**
  //  * Retrieves the text for the given offence code.
  //  * @param offenceCode - The offence code to retrieve the text for.
  //  * @returns An Observable that emits the offence text.
  //  */
  // public getOffenceCodeText(offenceCode: string): Observable<string> {
  //   return this.opalFinesService.getOffenceByCjsCode(offenceCode).pipe(
  //     map((offence) => {
  //       return offence.refData[0].offence_title;
  //     }),
  //   );
  // }

  /**
   * Navigates to the specified route.
   * @param route - The route to navigate to.
   * @param event - The optional event object.
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([`${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${route}`]);
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  public ngOnInit(): void {
    this.getOffencesImpositions();
  }
}
