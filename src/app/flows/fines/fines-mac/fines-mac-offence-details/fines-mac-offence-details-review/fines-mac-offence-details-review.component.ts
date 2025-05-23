import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary/fines-mac-offence-details-review-summary.component';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { CommonModule } from '@angular/common';
import { IFinesMacOffenceDetailsReviewSummaryForm } from './interfaces/fines-mac-offence-details-review-summary-form.interface';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fines-mac-offence-details-review',
  imports: [CommonModule, FinesMacOffenceDetailsReviewSummaryComponent],
  templateUrl: './fines-mac-offence-details-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewComponent implements OnInit, OnDestroy {
  @Input({ required: false }) public isReadOnly = false;
  @Input({ required: false }) public results!: IOpalFinesResultsRefData;
  @Input({ required: false }) public majorCreditors!: IOpalFinesMajorCreditorRefData;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);
  private readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  private readonly dateService = inject(DateService);
  public offencesImpositions!: IFinesMacOffenceDetailsReviewSummaryForm[];

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

  public ngOnInit(): void {
    this.results = this.activatedRoute.snapshot.data['results'];
    this.majorCreditors = this.activatedRoute.snapshot.data['majorCreditors'];
    this.getOffencesImpositions();
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsStore.setAddedOffenceCode('');
    this.finesMacOffenceDetailsStore.setMinorCreditorAdded(false);
    this.finesMacOffenceDetailsStore.setOffenceRemoved(false);
    if (this.finesMacOffenceDetailsStore.offenceDetailsDraft()) {
      this.finesMacOffenceDetailsStore.setOffenceDetailsDraft([]);
    }
  }
}
