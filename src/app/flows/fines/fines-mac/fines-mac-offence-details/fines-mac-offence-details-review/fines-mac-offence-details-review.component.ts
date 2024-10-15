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
import { DateService } from '@services/date-service/date.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { GovukHeadingWithCaptionComponent } from '@components/govuk/govuk-heading-with-caption/govuk-heading-with-caption.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListRowActionsComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-actions.component';
import { Observable, map } from 'rxjs';
import { IFinesMacOffenceDetailsImpositionsState } from '../interfaces/fines-mac-offence-details-impositions-state.interface';
import { UtilsService } from '@services/utils/utils.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';

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
  public readonly dateService = inject(DateService);
  public readonly utilsService = inject(UtilsService);

  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  public readonly resultCodeData$: Observable<IOpalFinesResultsRefData> = this.opalFinesService.getResults(
    this.resultCodeArray,
  );

  public offencesImpositions!: IFinesMacOffenceDetailsForm[];
  public impositions!: IFinesMacOffenceDetailsImpositionsState[];

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

  private getOffencesImpositions(): void {
    this.offencesImpositions = this.removeIndexFromImpositionKeys(this.finesService.finesMacState.offenceDetails);
  }

  /**
   * Calculates the total value of a specific field in the offence details impositions for each offence.
   *
   * @param offences - An array of `IFinesMacOffenceDetailsForm` objects representing the offences.
   * @param fieldName - The name of the field to calculate the total for.
   * @returns A string representing the total value converted to a monetary string.
   */
  public calculateOffencesTotal(
    offences: IFinesMacOffenceDetailsForm[],
    fieldName: keyof IFinesMacOffenceDetailsImpositionsState,
  ): string {
    const total = offences.reduce((offenceTotal, offence) => {
      const impositionTotal = offence.formData.fm_offence_details_impositions.reduce((impositionTotal, imposition) => {
        return impositionTotal + parseFloat(imposition[fieldName] as string);
      }, 0);

      return offenceTotal + impositionTotal;
    }, 0);

    return this.utilsService.convertToMonetaryString(total);
  }

  /**
   * Calculates the total value of a specific field in an array of `IFinesMacOffenceDetailsImpositionsState` objects.
   *
   * @param impositions - An array of `IFinesMacOffenceDetailsImpositionsState` objects.
   * @param fieldName - The name of the field to calculate the total for.
   * @returns The total value of the specified field as a formatted monetary string.
   */
  public calculateImpositionTotals(
    impositions: IFinesMacOffenceDetailsImpositionsState[],
    fieldName: keyof IFinesMacOffenceDetailsImpositionsState,
  ): string {
    const total = impositions.reduce((total, imposition) => {
      return total + parseFloat(imposition[fieldName] as string);
    }, 0);
    return this.utilsService.convertToMonetaryString(total);
  }

  /**
   * Retrieves the description of a result code from the provided reference data.
   * @param resultCodes - The reference data containing the result codes.
   * @param resultCode - The result code for which to retrieve the description.
   * @returns The description of the specified result code.
   */
  public getResultCodeDescription(resultCodes: IOpalFinesResultsRefData, resultCode: string): string {
    return resultCodes.refData.filter((result) => result.result_id === resultCode)[0].result_title;
  }

  /**
   * Retrieves the text for the given offence code.
   * @param offenceCode - The offence code to retrieve the text for.
   * @returns An Observable that emits the offence text.
   */
  public getOffenceCodeText(offenceCode: string): Observable<string> {
    return this.opalFinesService.getOffenceByCjsCode(offenceCode).pipe(
      map((offence) => {
        return offence.refData[0].offence_title;
      }),
    );
  }

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
