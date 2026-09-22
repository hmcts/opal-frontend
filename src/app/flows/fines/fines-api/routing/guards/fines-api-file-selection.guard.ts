import { inject } from '@angular/core';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';

const redirectToProcessAllocate = () =>
  `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.autoPaymentIn.root}/${FINES_API_ROUTING_PATHS.children.processAllocate}`;

export const finesApiFileSelectionGuard = hasFlowStateGuard(
  () => inject(FinesApiStore),
  (store) => {
    const selectedFileIds = store.selectedFileIds();

    if (selectedFileIds.length === 0) {
      return false;
    }

    const selectedFileIdSet = new Set(selectedFileIds);
    const selectedInterfaceJobs = (store.processInterfaceJobs() ?? []).filter(
      ({ interface_file_id: interfaceFileId }) => selectedFileIdSet.has(interfaceFileId.toString()),
    );

    if (selectedInterfaceJobs.length !== selectedFileIdSet.size) {
      return false;
    }

    const selectedBusinessUnitIdSet = new Set(store.selectedBusinessUnitIds());
    const selectedBusinessUnitNames = new Set(
      store
        .availableBusinessUnits()
        .filter(({ business_unit_id: businessUnitId }) => selectedBusinessUnitIdSet.has(businessUnitId))
        .map(({ business_unit_name: businessUnitName }) => businessUnitName),
    );

    return selectedInterfaceJobs.every(({ business_unit_name: businessUnitName }) =>
      selectedBusinessUnitNames.has(businessUnitName),
    );
  },
  redirectToProcessAllocate,
);
