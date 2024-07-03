import { Injectable, inject } from '@angular/core';
import { GlobalStateService } from '../global-state-service/global-state.service';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ExpiryService {
  private readonly globalStateService = inject(GlobalStateService);

  /**
   * Checks the expiry of the session and sets the session timeout warning accordingly.
   */
  public checkExpiry(): void {
    const minutesDifference = this.calculateMinuteDifference();

    if (minutesDifference < 30) {
      this.globalStateService.sessionTimeoutWarning.set(true);
    } else {
      this.globalStateService.sessionTimeoutWarning.set(false);
    }
  }

  /**
   * Calculates the difference in minutes between the current timestamp and the expiry timestamp.
   * @returns The difference in minutes.
   */
  public calculateMinuteDifference(): number {
    if (this.globalStateService.tokenExpiry) {
      const { expiry } = this.globalStateService.tokenExpiry;
      if (expiry) {
        const expiryTimestamp = DateTime.fromISO(expiry);

        const timestamp = DateTime.now();

        const minuteDifference = expiryTimestamp.diff(timestamp, 'minutes');
        return minuteDifference.minutes > 0 ? Math.floor(minuteDifference.minutes) : 0;
      }

      return 0;
    }
    return 0;
  }
}
