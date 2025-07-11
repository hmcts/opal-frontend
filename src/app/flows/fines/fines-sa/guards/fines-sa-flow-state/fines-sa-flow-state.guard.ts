import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FinesSaService } from '../../services/fines-sa.service';
import { inject } from '@angular/core';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';

export const finesSaFlowStateGuard = hasFlowStateGuard(
  /**
   * Retrieves the current search account state from the FinesSaStore.
   */
  () => inject(FinesSaStore).searchAccount(),

  /**
   * Determines whether navigation should proceed based on whether the user has entered any search criteria.
   * Includes checks for account number, reference number, or any tab-specific search criteria.
   * @param searchAccount - The current state of the search account form.
   * @returns True if any valid search input is present; false otherwise.
   */
  (searchAccount) => {
    const finesSaService = inject(FinesSaService);
    const accountNumber = !!searchAccount.fsa_search_account_number?.trim();
    const reference = !!searchAccount.fsa_search_account_reference_case_number?.trim();
    const criteria = finesSaService.hasAnySearchCriteriaPopulated(searchAccount);

    return accountNumber || reference || criteria;
  },

  /**
   * Redirects the user to the base search screen if no flow state is present.
   * @returns A fallback URL string.
   */
  () => `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.sa.root}/${FINES_SA_ROUTING_PATHS.children.search}`,
);
