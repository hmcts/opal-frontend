import { Component, inject, OnInit } from '@angular/core';
import { AbstractFormArrayRemovalComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-array-removal-base';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsReviewOffenceComponent } from '../fines-mac-offence-details-review-offence/fines-mac-offence-details-review-offence.component';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details.service';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';

@Component({
  selector: 'app-fines-mac-offence-details-remove-offence-and-impositions',
  imports: [GovukButtonComponent, GovukCancelLinkComponent, FinesMacOffenceDetailsReviewOffenceComponent],
  templateUrl: './fines-mac-offence-details-remove-offence-and-impositions.component.html',
})
export class FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit
{
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);
  private readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
  public offence!: IFinesMacOffenceDetailsForm;
  public results!: IOpalFinesResultsRefData;
  public majorCreditors!: IOpalFinesMajorCreditorRefData;

  /**
   * Retrieves the offence and its associated impositions from the fines service
   * and assigns it to the local `offence` property.
   *
   * @private
   * @returns {void}
   */
  private getOffenceAndImpositions(): void {
    this.offence = this.finesMacOffenceDetailsService.removeIndexFromImpositionKey(this.finesMacStore.offenceDetails())[
      this.finesMacOffenceDetailsStore.offenceIndex()
    ];
  }

  /**
   * Confirms the removal of an offence from the offence details list.
   *
   * This method performs the following actions:
   * 1. Retrieves the offence details and the index of the offence to be removed.
   * 2. Removes the offence from the offence details list.
   * 3. Decreases the `fm_offence_details_id` of each offence that comes after the removed offence.
   * 4. Sets the `offenceRemoved` flag to true.
   * 5. Navigates to the review offences route.
   *
   * @returns {void}
   */
  public confirmOffenceRemoval(): void {
    const offenceDetails = structuredClone(this.finesMacStore.offenceDetails());
    const startIndex = this.finesMacOffenceDetailsStore.offenceIndex();

    offenceDetails.splice(this.finesMacOffenceDetailsStore.offenceIndex(), 1);

    // decrease the fm_offence_details_id of each offence after the removed offence
    for (const offence of offenceDetails.slice(startIndex)) {
      if (offence?.formData?.fm_offence_details_id !== undefined) {
        offence.formData.fm_offence_details_id -= 1;
      }
    }

    this.finesMacOffenceDetailsStore.setOffenceRemoved(true);
    this.finesMacStore.setOffenceDetails(offenceDetails);
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.reviewOffences);
  }

  public ngOnInit(): void {
    this.results = this['activatedRoute'].snapshot.data['results'];
    this.majorCreditors = this['activatedRoute'].snapshot.data['majorCreditors'];
    this.getOffenceAndImpositions();
  }
}
