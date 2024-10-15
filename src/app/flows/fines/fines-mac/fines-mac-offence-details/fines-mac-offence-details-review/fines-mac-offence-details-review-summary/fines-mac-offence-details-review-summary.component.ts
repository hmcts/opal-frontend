import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IFinesMacOffenceDetailsForm } from '../../interfaces/fines-mac-offence-details-form.interface';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent } from './fines-mac-offence-details-review-summary-date-of-sentence/fines-mac-offence-details-review-summary-date-of-sentence.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { CommonModule } from '@angular/common';
import { FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent } from './fines-mac-offence-details-review-summary-offence-title/fines-mac-offence-details-review-summary-offence-title.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { EMPTY, Observable, map } from 'rxjs';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { FinesMacOffenceDetailsReviewSummaryImpositionTableComponent } from './fines-mac-offence-details-review-summary-imposition-table/fines-mac-offence-details-review-summary-imposition-table.component';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent } from './fines-mac-offence-details-review-summary-offences-total/fines-mac-offence-details-review-summary-offences-total.component';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary',
  standalone: true,
  imports: [
    CommonModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent,
    FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent,
    FinesMacOffenceDetailsReviewSummaryImpositionTableComponent,
    FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent,
  ],
  templateUrl: './fines-mac-offence-details-review-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './fines-mac-offence-details-review-summary.component.scss',
})
export class FinesMacOffenceDetailsReviewSummaryComponent implements OnInit {
  @Input({ required: true }) public impositionRefData!: IOpalFinesResultsRefData;
  @Input({ required: true }) public majorCreditorRefData!: IOpalFinesMajorCreditorRefData;
  @Input({ required: true }) public offencesImpositions!: IFinesMacOffenceDetailsForm[];

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly opalFinesService = inject(OpalFines);

  protected readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  public offenceRefData$: Observable<IOpalFinesOffencesRefData> = EMPTY;

  private getOffenceRefData(): void {
    const offenceCodes = this.offencesImpositions.map((offence) => offence.formData.fm_offence_details_offence_code!);
    this.offenceRefData$ = this.opalFinesService.getOffencesByCjsCodes(offenceCodes).pipe(map((result) => result));
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
    console.log('FinesMacOffenceDetailsReviewSummaryComponent', this.impositionRefData);

    if (this.offencesImpositions.length > 0) {
      this.getOffenceRefData();
    }
  }
}
