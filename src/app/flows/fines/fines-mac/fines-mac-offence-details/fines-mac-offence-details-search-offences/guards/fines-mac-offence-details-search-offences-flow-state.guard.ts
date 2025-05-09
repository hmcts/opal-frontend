import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';

export const finesMacOffenceDetailsSearchOffencesFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesMacOffenceDetailsSearchOffencesStore).searchOffences(),
  (searchOffences) => {
    return (
      !!searchOffences.formData.fm_offence_details_search_offences_code ||
      !!searchOffences.formData.fm_offence_details_search_offences_short_title ||
      !!searchOffences.formData.fm_offence_details_search_offences_act_and_section
    );
  },
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.offenceDetails}/${FINES_MAC_ROUTING_PATHS.children.searchOffences}`,
);
