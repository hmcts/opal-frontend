import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesConSearchResultDefendantTableWrapperComponent } from './fines-con-search-result-defendant-table-wrapper/fines-con-search-result-defendant-table-wrapper.component';
import { IFinesConSearchResultDefendantTableWrapperTableData } from './fines-con-search-result-defendant-table-wrapper/interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { IFinesConSearchResultDefendantAccount } from './interfaces/fines-con-search-result-defendant-account.interface';
import { IFinesConSearchResultData } from './interfaces/fines-con-search-result-data.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-con-search-result-defendant-table-wrapper/constants/fines-con-search-result-defendant-table-wrapper-table-sort-default.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { FinesConDefendant } from '../../types/fines-con-defendant.type';
import { FinesConStore } from '../../stores/fines-con.store';
import { IFinesConSearchResultAccountCheck } from './interfaces/fines-con-search-result-account-check.interface';
import { FinesConPayloadService } from '../../services/fines-con-payload.service';
import { FinesConSearchResultSource } from './types/fines-con-search-result-source.type';

@Component({
  selector: 'app-fines-con-search-result',
  imports: [CommonModule, AsyncPipe, FinesConSearchResultDefendantTableWrapperComponent],
  templateUrl: './fines-con-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchResultComponent implements OnDestroy {
  private readonly MAX_RESULTS_WARNING_THRESHOLD = 100;
  private readonly EMPTY_RESULTS: IFinesConSearchResultData = {
    tableData: [],
    checksByAccountId: {},
  };
  private readonly router = inject(Router);
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesConStore = inject(FinesConStore);
  private readonly finesConPayloadService = inject(FinesConPayloadService);
  private readonly resultsSourceSubject = new BehaviorSubject<FinesConSearchResultSource>({ type: 'store' });
  private latestSearchResults: IFinesConSearchResultData = this.EMPTY_RESULTS;

  public readonly defendantsSort = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public readonly searchResults$: Observable<IFinesConSearchResultData> = this.resultsSourceSubject.pipe(
    switchMap((source) => this.resolveResultsSource(source)),
    tap((results) => {
      this.latestSearchResults = results;
    }),
  );
  public defendantAccountsData: IFinesConSearchResultDefendantAccount[] = [];

  @Input({ required: true })
  public defendantType: FinesConDefendant = 'individual';

  @Input({ required: false })
  public set searchPayload(searchPayload: IOpalFinesDefendantAccountSearchParams | null) {
    if (!searchPayload) {
      this.resultsSourceSubject.next({ type: 'store' });
      return;
    }

    this.resultsSourceSubject.next({ type: 'payload', searchPayload });
  }

  @Input({ required: false })
  public set defendantAccounts(defendantAccounts: IFinesConSearchResultDefendantAccount[] | null) {
    this.resultsSourceSubject.next({ type: 'accounts', defendantAccounts: defendantAccounts ?? [] });
  }

  public get tableData(): IFinesConSearchResultDefendantTableWrapperTableData[] {
    return this.latestSearchResults.tableData;
  }

  public get checksByAccountId(): Record<number, IFinesConSearchResultAccountCheck[]> {
    return this.latestSearchResults.checksByAccountId;
  }

  /**
   * Resolves the latest result source into mapped table data.
   */
  private resolveResultsSource(source: FinesConSearchResultSource): Observable<IFinesConSearchResultData> {
    switch (source.type) {
      case 'accounts':
        this.syncStoreResults(source.defendantAccounts);
        return of(this.mapResults(source.defendantAccounts));
      case 'payload':
        return this.fetchDefendantAccounts(source.searchPayload);
      case 'store':
      default:
        return of(this.mapResults(this.getStoredResults()));
    }
  }

  /**
   * Rehydrates raw defendant accounts from the current store bucket.
   */
  private getStoredResults(): IFinesConSearchResultDefendantAccount[] {
    return this.defendantType === 'company'
      ? this.finesConStore.companyResults()
      : this.finesConStore.individualResults();
  }

  /**
   * Persists the latest raw results in the correct store bucket for the current defendant type.
   *
   * @param defendantAccounts - Raw defendant accounts to store.
   */
  private syncStoreResults(defendantAccounts: IFinesConSearchResultDefendantAccount[]): void {
    if (this.defendantType === 'company') {
      this.finesConStore.updateDefendantResults([], defendantAccounts);
    } else {
      this.finesConStore.updateDefendantResults(defendantAccounts, []);
    }
  }

  /**
   * Calls defendant account search API and maps returned results for table display.
   */
  private fetchDefendantAccounts(
    searchPayload: IOpalFinesDefendantAccountSearchParams,
  ): Observable<IFinesConSearchResultData> {
    const payload: IOpalFinesDefendantAccountSearchParams = {
      ...searchPayload,
      consolidation_search: true,
    };

    return this.opalFinesService.getDefendantAccounts(payload).pipe(
      map((response) => this.finesConPayloadService.extractDefendantAccounts(response)),
      tap((defendantAccounts) => this.syncStoreResults(defendantAccounts)),
      map((defendantAccounts) => this.mapResults(defendantAccounts)),
      catchError(() => {
        this.defendantAccountsData = [];
        return of(this.EMPTY_RESULTS);
      }),
    );
  }

  /**
   * Maps raw accounts into the table result view model.
   */
  private mapResults(defendantAccounts: IFinesConSearchResultDefendantAccount[]): IFinesConSearchResultData {
    if (defendantAccounts.length > this.MAX_RESULTS_WARNING_THRESHOLD) {
      // eslint-disable-next-line no-console
      console.log('more than 100 results');

      this.defendantAccountsData = [];
      this.syncStoreResults([]);
      return this.EMPTY_RESULTS;
    }

    this.defendantAccountsData = defendantAccounts;
    return {
      tableData: this.finesConPayloadService.mapDefendantAccounts(defendantAccounts),
      checksByAccountId: this.finesConPayloadService.buildChecksByAccountId(defendantAccounts),
    };
  }

  /**
   * Opens the defendant At a Glance screen in a new browser tab.
   */
  public onAccountIdClick(accountId: number): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        FINES_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.children.defendant,
        accountId,
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      ]),
    );

    window.open(url, '_blank');
  }

  public ngOnDestroy(): void {
    this.resultsSourceSubject.complete();
  }
}
