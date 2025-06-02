import { inject, Injectable } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_MAC_ACCOUNT_TYPES } from '../../fines-mac/constants/fines-mac-account-types';
import { IFinesDraftTableWrapperTableData } from '../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FinesDraftService {
  private readonly router = inject(Router);
  private readonly dateService = inject(DateService);

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
