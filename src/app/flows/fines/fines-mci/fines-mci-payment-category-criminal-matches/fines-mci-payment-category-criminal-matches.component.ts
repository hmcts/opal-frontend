import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import {
  FinesMciCriminalAccountId,
  IFinesMciCriminalAccount,
} from '../interfaces/fines-mci-criminal-account.interface';
import { catchError, EMPTY, finalize, map, Subject, takeUntil } from 'rxjs';
import { FinesMciCriminalAccountService } from '../services/fines-mci-criminal-account.service';
import { IFinesMciCriminalAccountsResult } from '../interfaces/fines-mci-criminal-accounts-result.interface';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import {
  FINES_MCI_CRIMINAL_SEARCH_RESULTS,
  FinesMciCriminalSearchResults,
} from '../constants/fines-mci-criminal-search-results.constant';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERROR_FIELD_IDS } from './constants/fines-mci-payment-category-criminal-matches-errors.constant';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-mci-payment-category-criminal-matches-table-wrapper/constants/fines-mci-payment-category-criminal-matches-table-wrapper-table-sort-default.constant';
import {
  FinesMciPaymentCategoryCriminalMatchesTableWrapperComponent,
  IFinesMciPaymentCategoryCriminalMatchesTableWrapperAccountSelection,
} from './fines-mci-payment-category-criminal-matches-table-wrapper/fines-mci-payment-category-criminal-matches-table-wrapper.component';
import { IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData } from './fines-mci-payment-category-criminal-matches-table-wrapper/interfaces/fines-mci-payment-category-criminal-matches-table-wrapper-table-data.interface';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import { finesMciPaymentCategoryCriminalMatchesSelectionValidator } from './validators/fines-mci-payment-category-criminal-matches.validator';

interface FinesMciCriminalMatchesContent {
  heading: string;
  ticket: string;
  body: string;
}

type FinesMciCriminalMatchesPlaceholderResults = Exclude<
  FinesMciCriminalSearchResults,
  typeof FINES_MCI_CRIMINAL_SEARCH_RESULTS.matches
>;

const FINES_MCI_CRIMINAL_MATCHES_CONTENT: Record<
  FinesMciCriminalMatchesPlaceholderResults,
  FinesMciCriminalMatchesContent
> = {
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
  imports: [FinesMciPaymentCategoryCriminalMatchesTableWrapperComponent, GovukBackLinkComponent, RouterLink],
  templateUrl: './fines-mci-payment-category-criminal-matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalMatchesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly criminalAccountService = inject(FinesMciCriminalAccountService);
  private readonly cancelAccountDetailsRequest = new Subject<void>();
  private readonly selectedAccountIdsSignal = signal<Set<FinesMciCriminalAccountId>>(new Set());
  private readonly selectionValidationMessageSignal = signal<string | null>(null);
  private readonly accountsResult = toSignal(
    this.route.data.pipe(map((data) => data['criminalAccounts'] as IFinesMciCriminalAccountsResult)),
    { requireSync: true },
  );
  private readonly results = computed(() => this.accountsResult().results);

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isLoadingAccountDetails = signal(false);
  protected readonly selectionErrorFieldId =
    FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERROR_FIELD_IDS.accountSelection;
  protected readonly content = computed(
    () => FINES_MCI_CRIMINAL_MATCHES_CONTENT[this.results() as FinesMciCriminalMatchesPlaceholderResults],
  );
  protected readonly searchResults = computed(
    () => this.finesMciStore.criminalSearchResults()?.defendant_accounts ?? [],
  );
  protected readonly selectedAccountIds = computed(() => [...this.selectedAccountIdsSignal()]);
  protected readonly selectionValidationMessage = computed(() => this.selectionValidationMessageSignal());
  protected readonly hasSelectionValidationError = computed(() => !!this.selectionValidationMessageSignal());
  protected readonly tableData = computed(() => this.mapAccountsToTableData(this.searchResults()));
  protected readonly sortState = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  protected readonly isMatchesResults = computed(() => this.results() === FINES_MCI_CRIMINAL_SEARCH_RESULTS.matches);
  protected readonly tillDetailsRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.details,
  ];
  protected readonly criminalSearchRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.payment,
    FINES_MCI_ROUTING_PATHS.children.category,
    FINES_MCI_ROUTING_PATHS.children.criminal,
    FINES_MCI_ROUTING_PATHS.children.search,
  ];

  constructor() {
    effect(() => {
      this.cancelAccountDetailsRequest.next();
      this.finesMciStore.setCriminalSearchResults(this.accountsResult().response);
      this.selectedAccountIdsSignal.set(new Set());
      this.selectionValidationMessageSignal.set(null);
    });
  }

  private formatDefendantName(account: IFinesMciCriminalAccount): string | null {
    if (account.organisation ?? account.organisation_flag) {
      return account.organisation_name;
    }

    if (!account.defendant_surname && !account.defendant_firstnames) {
      return null;
    }

    const surname = account.defendant_surname?.toUpperCase() ?? '';
    const firstnames = account.defendant_firstnames ?? '';
    const separator = account.defendant_surname && account.defendant_firstnames ? ', ' : '';
    return `${surname}${separator}${firstnames}`;
  }

  private formatAliases(account: IFinesMciCriminalAccount): string | null {
    if (!account.aliases || account.aliases.length === 0) {
      return null;
    }

    const aliases = [...account.aliases]
      .sort((a, b) => (a.alias_number ?? Infinity) - (b.alias_number ?? Infinity))
      .map((alias) => {
        if (account.organisation ?? account.organisation_flag) {
          return alias.organisation_name;
        }

        const surname = alias.surname ?? '';
        const forenames = alias.forenames ?? '';
        const separator = alias.surname && alias.forenames ? ', ' : '';
        return `${surname}${separator}${forenames}`;
      });

    return aliases.filter(Boolean).join('\n') || null;
  }

  private mapAccountsToTableData(
    accounts: IFinesMciCriminalAccount[],
  ): IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData[] {
    return accounts.map((account) => ({
      'Account ID': account.defendant_account_id,
      Account: account.account_number,
      Name: this.formatDefendantName(account),
      Aliases: this.formatAliases(account),
      'Date of birth': (account.organisation ?? account.organisation_flag) ? null : account.birth_date,
      'Address line 1': account.address_line_1,
      Postcode: account.postcode,
      Balance: account.account_balance,
      Enf: account.last_enforcement_action,
      CO: account.has_collection_order ? 'Y' : null,
    }));
  }

  protected navigateBack(): void {
    this.router.navigate(this.criminalSearchRoute);
  }

  protected handleSearchAgain(): void {
    this.cancelAccountDetailsRequest.next();
    this.finesMciStore.setSelectedCriminalAccount(null);
  }

  protected onAccountSelectionChanged(
    accountSelection: IFinesMciPaymentCategoryCriminalMatchesTableWrapperAccountSelection,
  ): void {
    this.cancelAccountDetailsRequest.next();
    const selectedAccountIds = new Set(this.selectedAccountIdsSignal());

    if (accountSelection.selected) {
      selectedAccountIds.add(accountSelection.accountId);
    } else {
      selectedAccountIds.delete(accountSelection.accountId);
    }

    this.selectedAccountIdsSignal.set(selectedAccountIds);
    this.selectionValidationMessageSignal.set(null);
    this.finesMciStore.setSelectedCriminalAccount(null);
  }

  protected continue(): void {
    if (this.isLoadingAccountDetails()) {
      return;
    }

    const selectedAccountIds = this.selectedAccountIds();
    const validationMessage = finesMciPaymentCategoryCriminalMatchesSelectionValidator(selectedAccountIds);

    if (validationMessage) {
      this.selectionValidationMessageSignal.set(validationMessage);
      return;
    }

    this.selectionValidationMessageSignal.set(null);

    const selectedAccount =
      this.searchResults().find((account) => account.defendant_account_id === selectedAccountIds[0]) ?? null;
    if (!selectedAccount || selectedAccount.defendant_account_id === null) {
      return;
    }

    this.isLoadingAccountDetails.set(true);
    this.criminalAccountService
      .loadSelectedAccountDetails(selectedAccount)
      .pipe(
        catchError(() => EMPTY),
        finalize(() => this.isLoadingAccountDetails.set(false)),
        takeUntil(this.cancelAccountDetailsRequest),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        void this.router.navigate(
          [
            FINES_MCI_ROUTING_PATHS.children.account,
            selectedAccount.defendant_account_id,
            (selectedAccount.organisation ?? selectedAccount.organisation_flag) ? 'company' : 'individual',
          ],
          { relativeTo: this.route.parent },
        );
      });
  }
}
