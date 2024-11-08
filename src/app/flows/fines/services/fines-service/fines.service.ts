import { inject, Injectable } from '@angular/core';
import { IFinesMacState } from '../../fines-mac/interfaces/fines-mac-state.interface';
import { FINES_MAC_STATE } from '../../fines-mac/constants/fines-mac-state';
import { DateService } from '@services/date-service/date.service';

@Injectable({
  providedIn: 'root',
})
export class FinesService {
  private readonly dateService = inject(DateService);

  // Non reactive state
  public finesMacState: IFinesMacState = FINES_MAC_STATE;

  /**
   * Retrieves the earliest date of sentence from the offence details.
   *
   * This method iterates through the offence details and finds the earliest date
   * of offence using the provided date format. If no offence details are available,
   * it returns null.
   *
   * @returns {Date | null} The earliest date of offence or null if no offence details are present.
   */
  public getEarliestDateOfSentence(): Date | null {
    return this.finesMacState.offenceDetails.reduce(
      (mostRecent, offence) => {
        const offenceDate = this.dateService.getDateFromFormat(
          offence.formData.fm_offence_details_date_of_offence!,
          'dd/MM/yyyy',
        );
        return offenceDate && (!mostRecent || offenceDate < mostRecent) ? offenceDate : mostRecent;
      },
      null as Date | null,
    );
  }
}
