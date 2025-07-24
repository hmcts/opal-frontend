import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary/fines-mac-offence-details-review-summary.component';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';

import { IFinesMacOffenceDetailsReviewSummaryForm } from './interfaces/fines-mac-offence-details-review-summary-form.interface';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fines-mac-offence-details-review',
  imports: [FinesMacOffenceDetailsReviewSummaryComponent],
  templateUrl: './fines-mac-offence-details-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);
  private readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  private readonly dateService = inject(DateService);

  @Input({ required: false }) public isReadOnly = false;
  @Input({ required: false }) public results!: IOpalFinesResultsRefData;
  @Input({ required: false }) public majorCreditors!: IOpalFinesMajorCreditorRefData;
  public offencesImpositions!: IFinesMacOffenceDetailsReviewSummaryForm[];

  /**
   * Sorts the offence impositions in ascending order based on the offence date.
   *
   * This method retrieves the offence date from each offence's form data using
   * the specified format ('dd/MM/yyyy') with the date service. It then converts
   * these dates to their millisecond representations and sorts the array accordingly.
   *
   * @remarks
   * The method assumes that the offence's form data contains a valid date of
   * sentence string at the property 'fm_offence_details_date_of_sentence'.
   *
   * @example
   * Before sorting:
   * [
   *   { formData: { fm_offence_details_date_of_sentence: '15/03/2021' } },
   *   { formData: { fm_offence_details_date_of_sentence: '10/02/2022' } }
   * ]
   *
   * After sorting:
   * [
   *   { formData: { fm_offence_details_date_of_sentence: '15/03/2021' } },
   *   { formData: { fm_offence_details_date_of_sentence: '10/02/2022' } }
   * ]
   *
   * @private
   */
  private sortOffencesByDate(): void {
    this.offencesImpositions.sort((a, b) => {
      const dateOfOffenceA = this.dateService.getFromFormat(
        a.formData.fm_offence_details_date_of_sentence!,
        'dd/MM/yyyy',
      );
      const dateOfOffenceB = this.dateService.getFromFormat(
        b.formData.fm_offence_details_date_of_sentence!,
        'dd/MM/yyyy',
      );

      return dateOfOffenceA.toMillis() - dateOfOffenceB.toMillis();
    });
  }

  /**
   * Retrieves the offences impositions from the finesMacStore offenceDetails
   * and removes the index from the imposition keys.
   */
  private getOffencesImpositions(): void {
    this.offencesImpositions = this.finesMacOffenceDetailsService.removeIndexFromImpositionKey(
      this.finesMacStore.offenceDetails(),
    );
    this.sortOffencesByDate();
    this.finesMacOffenceDetailsStore.setEmptyOffences(this.offencesImpositions.length === 0);
  }

  /**
   * Lifecycle hook that is called once the component has been initialized.
   *
   * This method retrieves initialization data from the activated route snapshot:
   * - If available, assigns the 'results' property from the route data to the component's results property.
   * - If available, assigns the 'majorCreditors' property from the route data to the component's majorCreditors property.
   *
   * After setting the properties, it calls getOffencesImpositions() to process offense impositions.
   */
  public ngOnInit(): void {
    if (this.activatedRoute.snapshot.data['results']) {
      this.results = this.activatedRoute.snapshot.data['results'];
    }
    if (this.activatedRoute.snapshot.data['majorCreditors']) {
      this.majorCreditors = this.activatedRoute.snapshot.data['majorCreditors'];
    }
    this.getOffencesImpositions();
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   *
   * This method performs the following cleanup actions:
   * - Clears the offence code by setting it to an empty string.
   * - Resets the minor creditor flag to false.
   * - Flags that no offence has been removed.
   * - Resets any existing offence details draft to an empty list.
   *
   * These actions ensure that the offence details store is cleared and ready for reuse when the component is reactivated.
   */
  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsStore.setAddedOffenceCode('');
    this.finesMacOffenceDetailsStore.setMinorCreditorAdded(false);
    this.finesMacOffenceDetailsStore.setOffenceRemoved(false);
    if (this.finesMacOffenceDetailsStore.offenceDetailsDraft()) {
      this.finesMacOffenceDetailsStore.setOffenceDetailsDraft([]);
    }
  }
}
