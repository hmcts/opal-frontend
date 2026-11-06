import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { FinesMciStore } from '../stores/fines-mci.store';
import { IFinesMciCriminalAccountsResult } from '../interfaces/fines-mci-criminal-accounts-result.interface';
import {
  FINES_MCI_CRIMINAL_SEARCH_RESULTS,
  FinesMciCriminalSearchResults,
} from '../constants/fines-mci-criminal-search-results.constant';

interface FinesMciCriminalMatchesContent {
  heading: string;
  ticket: string;
  body: string;
}

const FINES_MCI_CRIMINAL_MATCHES_CONTENT: Record<FinesMciCriminalSearchResults, FinesMciCriminalMatchesContent> = {
  [FINES_MCI_CRIMINAL_SEARCH_RESULTS.matches]: {
    heading: 'Matching criminal accounts',
    ticket: 'PO-3490',
    body: 'The design and functionality for matching criminal account results will be implemented under ticket PO-3490.',
  },
  [FINES_MCI_CRIMINAL_SEARCH_RESULTS.noMatches]: {
    heading: 'No matching criminal accounts',
    ticket: 'PO-3528',
    body: 'The design and functionality for no matching criminal account results will be implemented under ticket PO-3528.',
  },
  [FINES_MCI_CRIMINAL_SEARCH_RESULTS.tooMany]: {
    heading: 'More than 100 matching criminal accounts',
    ticket: 'PO-3528',
    body: 'The design and functionality for searches returning more than 100 criminal account results will be implemented under ticket PO-3528.',
  },
  [FINES_MCI_CRIMINAL_SEARCH_RESULTS.searchCriteriaCannotBeCombined]: {
    heading: 'Search criteria cannot be combined',
    ticket: 'PO-3529',
    body: 'The design and functionality for searches where reference data and account information are entered together will be implemented under ticket PO-3529.',
  },
};

@Component({
  selector: 'app-fines-mci-payment-category-criminal-matches',
  templateUrl: './fines-mci-payment-category-criminal-matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalMatchesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly accountsResult = toSignal(
    this.route.data.pipe(map((data) => data['criminalAccounts'] as IFinesMciCriminalAccountsResult)),
    { requireSync: true },
  );
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly content = computed(() => FINES_MCI_CRIMINAL_MATCHES_CONTENT[this.accountsResult().results]);
}
