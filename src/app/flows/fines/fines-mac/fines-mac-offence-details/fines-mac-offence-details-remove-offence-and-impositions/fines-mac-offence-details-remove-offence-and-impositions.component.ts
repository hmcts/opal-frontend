import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractFormArrayRemovalComponent } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsReviewOffenceComponent } from '../fines-mac-offence-details-review-offence/fines-mac-offence-details-review-offence.component';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { forkJoin, Observable, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';

@Component({
  selector: 'app-fines-mac-offence-details-remove-offence-and-impositions',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, GovukCancelLinkComponent, FinesMacOffenceDetailsReviewOffenceComponent],
  templateUrl: './fines-mac-offence-details-remove-offence-and-impositions.component.html',
})
export class FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit
{
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);

  private readonly resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  private readonly impositionRefData$: Observable<IOpalFinesResultsRefData> = this.opalFinesService
    .getResults(this.resultCodeArray)
    .pipe(tap((response: IOpalFinesResultsRefData) => (this.impositionRefData = response)));
  private readonly majorCreditorRefData$: Observable<IOpalFinesMajorCreditorRefData> = this.opalFinesService
    .getMajorCreditors(this.finesService.finesMacState.businessUnit.business_unit_id)
    .pipe(tap((response: IOpalFinesMajorCreditorRefData) => (this.majorCreditorRefData = response)));
  public readonly referenceData$ = forkJoin({
    impositionRefData: this.impositionRefData$,
    majorCreditorRefData: this.majorCreditorRefData$,
  });

  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  public offence!: IFinesMacOffenceDetailsForm;
  public impositionRefData!: IOpalFinesResultsRefData;
  public majorCreditorRefData!: IOpalFinesMajorCreditorRefData;

  /**
   * Retrieves the offence and its associated impositions from the fines service
   * and assigns it to the local `offence` property.
   *
   * @private
   * @returns {void}
   */
  private getOffenceAndImpositions(): void {
    this.offence = this.finesMacOffenceDetailsService.removeIndexFromImpositionKeys(
      this.finesService.finesMacState.offenceDetails,
    )[0];
  }

  public confirmOffenceRemoval(): void {
    this.finesService.finesMacState.offenceDetails.splice(this.finesMacOffenceDetailsService.offenceIndex, 1);
    this.finesMacOffenceDetailsService.offenceRemoved = true;
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.reviewOffences);
  }

  public ngOnInit(): void {
    this.getOffenceAndImpositions();
  }
}
