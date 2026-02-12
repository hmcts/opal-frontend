import { FINES_CON_ROUTING_PATHS } from '../routing/constants/fines-con-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { inject } from '@angular/core';
import { FinesConStore } from '../stores/fines-con.store';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';

export const finesConFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesConStore).selectBuForm(),
  (selectBuForm) =>
    !!selectBuForm.formData.fcon_select_bu_business_unit_id && !!selectBuForm.formData.fcon_select_bu_defendant_type,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.con.root}/${FINES_CON_ROUTING_PATHS.children.selectBusinessUnit}`,
);
