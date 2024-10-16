import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, forkJoin, map } from 'rxjs';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes.constant';
import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary/fines-mac-offence-details-review-summary.component';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { CommonModule } from '@angular/common';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { DateService } from '@services/date-service/date.service';

@Component({
  selector: 'app-fines-mac-offence-details-review',
  standalone: true,
  imports: [CommonModule, FinesMacOffenceDetailsReviewSummaryComponent],
  templateUrl: './fines-mac-offence-details-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewComponent implements OnInit, OnDestroy {
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  private readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  private readonly dateService = inject(DateService);

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

  /**
   * Removes the index from the keys of the `fm_offence_details_impositions` array in each form data object.
   * @param forms - An array of `IFinesMacOffenceDetailsForm` objects.
   * @returns An array of `IFinesMacOffenceDetailsForm` objects with the index removed from the keys of `fm_offence_details_impositions`.
   */
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

  private sortOffencesByDate(): void {
    this.offencesImpositions.sort((a, b) => {
      const dateOfOffenceA = this.dateService.getFromFormat(
        a.formData.fm_offence_details_date_of_offence!,
        'dd/MM/yyyy',
      );
      const dateOfOffenceB = this.dateService.getFromFormat(
        b.formData.fm_offence_details_date_of_offence!,
        'dd/MM/yyyy',
      );
      if (!dateOfOffenceA && !dateOfOffenceB) return 0; // Both null, considered equal
      if (!dateOfOffenceA) return 1; // null values pushed to the end
      if (!dateOfOffenceB) return -1; // null values pushed to the end

      return dateOfOffenceA.toMillis() - dateOfOffenceB.toMillis(); // Compare dates by milliseconds
    });
  }

  /**
   * Retrieves the offences impositions from the finesMacState offenceDetails
   * and removes the index from the imposition keys.
   */
  private getOffencesImpositions(): void {
    this.offencesImpositions = this.removeIndexFromImpositionKeys(this.finesService.finesMacState.offenceDetails);
    this.sortOffencesByDate();
    this.finesMacOffenceDetailsService.emptyOffences = this.offencesImpositions.length === 0;
    this.finesMacOffenceDetailsService.disabledDates = this.offencesImpositions.map(
      (offence) => offence.formData.fm_offence_details_date_of_offence!,
    );
  }

  public ngOnInit(): void {
    this.getOffencesImpositions();
  }

  public ngOnDestroy(): void {
    this.finesMacOffenceDetailsService.addedOffenceCode = '';
  }
}
