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
    this.globalStateService.sessionTimeoutWarning.set(minutesDifference < 30);
  }

  /**
   * Calculates the difference in minutes between the current timestamp and the token expiry timestamp.
   * @returns The minute difference between the timestamps. Returns 0 if the difference is negative.
   */
  public calculateMinuteDifference(): number {
    const expiry = this.globalStateService.tokenExpiry?.expiry;
    const expiryTimestamp = DateTime.fromISO(expiry ?? '');
    const timestamp = DateTime.now();
    const minuteDifference = expiryTimestamp.diff(timestamp, 'minutes');
    return minuteDifference.minutes > 0 ? Math.floor(minuteDifference.minutes) : 0;
  }
}
