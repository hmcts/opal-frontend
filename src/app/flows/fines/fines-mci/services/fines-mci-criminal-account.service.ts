import { inject, Injectable } from '@angular/core';
import { defer, EMPTY, Observable, tap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { FinesMciStore } from '../stores/fines-mci.store';

@Injectable({ providedIn: 'root' })
export class FinesMciCriminalAccountService {
  private readonly opalFines = inject(OpalFines);
  private readonly store = inject(FinesMciStore);

  /** Loads the selected account details for the next payment page. */
  public loadSelectedAccountAtAGlance(
    account: IFinesMciCriminalAccount,
  ): Observable<IOpalFinesAccountDefendantAtAGlance> {
    return defer(() => {
      if (account.defendant_account_id === null) {
        return EMPTY;
      }

      this.store.setSelectedCriminalAccount(account);
      // The shared at-a-glance cache is not keyed by account ID.
      this.opalFines.clearCache('defendantAccountAtAGlanceCache$');
      return this.opalFines.getDefendantAccountAtAGlance(account.defendant_account_id).pipe(
        tap((atAGlance) => {
          if (this.store.selectedCriminalAccount() === account) {
            this.store.setSelectedCriminalAccountAtAGlance(atAGlance);
          }
        }),
      );
    });
  }
}
