import { inject, Injectable } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_MAC_ACCOUNT_TYPES } from '../../fines-mac/constants/fines-mac-account-types';
import { IFinesDraftTableWrapperTableData } from '../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../fines-mac/routing/constants/fines-mac-routing-paths.constant';

@Injectable({
  providedIn: 'root',
})
export class FinesDraftService {
  private readonly router = inject(Router);
  private readonly dateService = inject(DateService);

  private readonly BASE_PATH = `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/`;
  public readonly PATH_REVIEW_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`;
  public readonly PATH_AMEND_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;

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
}
