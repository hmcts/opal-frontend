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

  public offencesImpositions!: IFinesMacOffenceDetailsForm[];

  protected readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  private getOffencesImpositions(): void {
    this.offencesImpositions = this.finesService.finesMacState.offenceDetails;
    console.log(this.offencesImpositions);
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
