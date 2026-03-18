import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesConSearchResultDefendantTableWrapperComponent } from './fines-con-search-result-defendant-table-wrapper/fines-con-search-result-defendant-table-wrapper.component';
import { IFinesConSearchResultDefendantTableWrapperTableData } from './fines-con-search-result-defendant-table-wrapper/interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { IFinesConSearchResultDefendantAccount } from './interfaces/fines-con-search-result-defendant-account.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-con-search-result-defendant-table-wrapper/constants/fines-con-search-result-defendant-table-wrapper-table-sort-default.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { FinesConDefendant } from '../../types/fines-con-defendant.type';
import { FinesConStore } from '../../stores/fines-con.store';
import { IFinesConSearchResultAccountCheck } from './interfaces/fines-con-search-result-account-check.interface';
import { FinesConPayloadService } from '../../services/fines-con-payload.service';

@Component({
  selector: 'app-fines-con-search-result',
  imports: [CommonModule, FinesConSearchResultDefendantTableWrapperComponent],
  templateUrl: './fines-con-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchResultComponent implements OnDestroy {
  private readonly MAX_RESULTS_WARNING_THRESHOLD = 100;
  private readonly router = inject(Router);
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesConStore = inject(FinesConStore);
  private readonly finesConPayloadService = inject(FinesConPayloadService);
  private readonly cdr = inject(ChangeDetectorRef);
  private defendantAccountsSearchSubscription: Subscription | null = null;

  public readonly defendantsSort = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public tableData: IFinesConSearchResultDefendantTableWrapperTableData[] = [];
  public defendantAccountsData: IFinesConSearchResultDefendantAccount[] = [];
  public checksByAccountId: Record<number, IFinesConSearchResultAccountCheck[]> = {};

  @Input({ required: true })
  public defendantType: FinesConDefendant = 'individual';

  @Input({ required: false })
  public set searchPayload(searchPayload: IOpalFinesDefendantAccountSearchParams | null) {
    if (!searchPayload) {
      this.defendantAccountsSearchSubscription?.unsubscribe();
      this.defendantAccountsSearchSubscription = null;
      this.hydrateResultsFromStore();
      return;
    }

    this.fetchDefendantAccounts(searchPayload);
  }

  @Input({ required: false })
  public set defendantAccounts(defendantAccounts: IFinesConSearchResultDefendantAccount[] | null) {
    this.applyMappedResults(defendantAccounts ?? []);
  }

  /**
   * Rehydrates result table data from store buckets.
   */
  private hydrateResultsFromStore(): void {
    const defendantAccounts =
      this.defendantType === 'company' ? this.finesConStore.companyResults() : this.finesConStore.individualResults();

    this.applyMappedResults(defendantAccounts);
  }

  /**
   * Calls defendant account search API and maps returned results for table display.
   */
  private fetchDefendantAccounts(searchPayload: IOpalFinesDefendantAccountSearchParams): void {
    this.defendantAccountsSearchSubscription?.unsubscribe();

    const payload: IOpalFinesDefendantAccountSearchParams = {
      ...searchPayload,
      consolidation_search: true,
    };

    this.defendantAccountsSearchSubscription = this.opalFinesService
      .getDefendantAccounts(payload)
      .subscribe((response) => {
        const defendantAccounts = this.finesConPayloadService.extractDefendantAccounts(response);
        this.applyMappedResults(defendantAccounts);

        if (this.defendantType === 'company') {
          this.finesConStore.updateDefendantResults([], defendantAccounts);
        } else {
          this.finesConStore.updateDefendantResults(defendantAccounts, []);
        }

        this.cdr.markForCheck();
      });
  }

  private applyMappedResults(defendantAccounts: IFinesConSearchResultDefendantAccount[]): void {
    if (defendantAccounts.length > this.MAX_RESULTS_WARNING_THRESHOLD) {
      // eslint-disable-next-line no-console
      console.log('more than 100 results');

      this.defendantAccountsData = [];
      this.tableData = [];
      this.checksByAccountId = {};
      return;
    }

    this.defendantAccountsData = defendantAccounts;
    this.tableData = this.finesConPayloadService.mapDefendantAccounts(defendantAccounts);
    this.checksByAccountId = this.finesConPayloadService.buildChecksByAccountId(defendantAccounts);
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
    this.defendantAccountsSearchSubscription?.unsubscribe();
    this.defendantAccountsSearchSubscription = null;
  }
}
