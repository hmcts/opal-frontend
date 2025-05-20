import { inject, Injectable } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_MAC_ACCOUNT_TYPES } from '../../fines-mac/constants/fines-mac-account-types';
import { IFinesDraftTableWrapperTableData } from '../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_DRAFT_MAX_REJECTED } from '../constants/fines-draft-max-rejected.constant';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';

@Injectable({
  providedIn: 'root',
})
export class FinesDraftService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dateService = inject(DateService);
  private readonly opalFinesService = inject(OpalFines);

  public activeTab!: string;

  /**
   * Navigates to the review account page for the given draft account ID.
   *
   * @param draftAccountId - The ID of the draft account to review.
   * @returns void
   */
  private navigateToReviewAccount(draftAccountId: number, path: string): void {
    this.router.navigate([path, draftAccountId]);
  }

  /**
   * Formats the given count as a string, capping the value at `FINES_DRAFT_MAX_REJECTED`.
   * If the count exceeds `FINES_DRAFT_MAX_REJECTED`, returns a string in the format "{FINES_DRAFT_MAX_REJECTED}+".
   * Otherwise, returns the count as a string.
   *
   * @param count - The number to format.
   * @returns The formatted count as a string, with a "+" suffix if it exceeds the maximum allowed.
   */
  private formatCount(count: number): string {
    return count > FINES_DRAFT_MAX_REJECTED ? `${FINES_DRAFT_MAX_REJECTED}+` : `${count}`;
  }

  /**
   * Populates table data from the given response.
   *
   * @param {IOpalFinesDraftAccountsResponse} response - The response containing draft account summaries.
   * @returns {IFinesDraftTableWrapperTableData[]} An array of table data objects.
   */
  public populateTableData(response: IOpalFinesDraftAccountsResponse): IFinesDraftTableWrapperTableData[] {
    return response.summaries.map(({ draft_account_id, account_snapshot }) => {
      const { defendant_name, date_of_birth, created_date, account_type, business_unit_name, submitted_by_name } =
        account_snapshot;

      return {
        Account: '',
        'Defendant id': draft_account_id,
        Defendant: defendant_name,
        'Date of birth': date_of_birth,
        CreatedDate: created_date,
        Created: this.dateService.getDaysAgo(created_date),
        'Account type': FINES_MAC_ACCOUNT_TYPES[account_type as keyof typeof FINES_MAC_ACCOUNT_TYPES],
        'Business unit': business_unit_name,
        'Submitted by': submitted_by_name,
      };
    });
  }

  /**
   * Handles the click event on a defendant item.
   * Navigates to the review account page for the specified defendant.
   *
   * @param {number} id - The unique identifier of the defendant.
   * @returns {void}
   */
  public onDefendantClick(id: number, path: string): void {
    this.navigateToReviewAccount(id, path);
  }

  /**
   * Handles the tab switch by updating the active tab and triggering a router fragment update.
   *
   * @param fragment - The identifier of the tab to activate.
   */
  public handleTabSwitch(fragment: string): void {
    this.activeTab = fragment;
    this.router.navigate([], {
      relativeTo: this.activatedRoute.parent,
      fragment,
    });
  }

  /**
   * Creates an observable data stream for tabular data based on the selected tab fragment.
   *
   * @param initialData - The initial data to populate the table when the initial tab is selected.
   * @param initialTab - The identifier of the initial tab.
   * @param fragment$ - An observable emitting the currently selected tab fragment.
   * @param getParams - A function that returns the request parameters for fetching data based on the tab.
   * @returns An observable emitting arrays of table data wrappers for the selected tab.
   *
   * When the selected tab matches the initial tab, the stream emits table data populated from the initial data.
   * For other tabs, it fetches draft account data using the provided service and parameters, then maps the result to table data.
   * The fetched data is shared and replayed for subscribers.
   */
  public createTabDataStream(
    initialData: IOpalFinesDraftAccountsResponse,
    initialTab: string,
    fragment$: Observable<string>,
    getParams: (tab: string) => IOpalFinesDraftAccountParams,
  ): Observable<IFinesDraftTableWrapperTableData[]> {
    return fragment$.pipe(
      switchMap((tab) => {
        if (tab === initialTab) {
          return of(this.populateTableData(initialData));
        }

        return this.opalFinesService.getDraftAccounts(getParams(tab)).pipe(
          map((res) => this.populateTableData(res)),
          shareReplay(1),
        );
      }),
    );
  }

  /**
   * Creates an observable stream that emits a formatted string representing the count of rejected items,
   * depending on the currently selected tab and provided parameters.
   *
   * - If the current tab matches the `initialTab`, it emits the formatted `resolverRejectedCount`.
   * - Otherwise, it fetches the draft accounts using `opalFinesService.getDraftAccounts` with parameters from `getParams`,
   *   and emits the formatted count from the response.
   *
   * @param initialTab - The name of the tab to compare against the current fragment.
   * @param resolverRejectedCount - The initial count of rejected items to use if the tab matches `initialTab`.
   * @param fragment$ - An observable emitting the current tab or fragment identifier.
   * @param getParams - A function returning the parameters to use when fetching draft accounts.
   * @returns An observable emitting a formatted string representing the rejected count.
   */
  public createRejectedCountStream(
    initialTab: string,
    resolverRejectedCount: number,
    fragment$: Observable<string>,
    getParams: () => IOpalFinesDraftAccountParams,
  ): Observable<string> {
    return fragment$.pipe(
      switchMap((tab) => {
        if (tab === initialTab) {
          return of(this.formatCount(resolverRejectedCount));
        }

        return this.opalFinesService.getDraftAccounts(getParams()).pipe(map((res) => this.formatCount(res.count)));
      }),
    );
  }
}
