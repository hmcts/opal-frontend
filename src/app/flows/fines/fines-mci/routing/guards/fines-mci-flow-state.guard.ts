import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FINES_MCI_ROUTING_PATHS } from '../constants/fines-mci-routing-paths.constant';

export const finesMciFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesMciStore).businessUnit(),
  (businessUnit) => businessUnit !== null,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_MCI_ROUTING_PATHS.root}/${FINES_MCI_ROUTING_PATHS.children.create}/${FINES_MCI_ROUTING_PATHS.children.till}/${FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit}`,
);
