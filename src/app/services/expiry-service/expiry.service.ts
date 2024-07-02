import { Injectable, inject } from '@angular/core';
import { GlobalStateService } from '../global-state-service/global-state.service';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ExpiryService {
  private readonly globalStateService = inject(GlobalStateService);

  public checkExpiry(): void {
    const minutesDifference = this.calculateMinuteDifference();

    if (minutesDifference < 30) {
      this.globalStateService.sessionTimeoutWarning.set(true);
    } else {
      this.globalStateService.sessionTimeoutWarning.set(false);
    }
  }

  public calculateMinuteDifference(): number {
    const expiryTimestamp = DateTime.fromISO(this.globalStateService.sessionTimeout);

    //const timestamp = DateTime.now();
    const timestamp = DateTime.now().plus({ hours: 9, minutes: 30 });

    if (expiryTimestamp) {
      const minuteDifference = expiryTimestamp.diff(timestamp, 'minutes');
      return minuteDifference.minutes > 0 ? Math.floor(minuteDifference.minutes) : 0;
    }
    return 0;
  }
}
