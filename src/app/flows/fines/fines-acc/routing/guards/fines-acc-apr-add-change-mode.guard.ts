import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { FINES_ACC_APR_ADD_CHANGE_MODES } from '../../fines-acc-apr-add-change/constants/fines-acc-apr-add-change-modes.constant';
import { FINES_ACC_APR_ROUTING_PATHS } from '../../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

export const finesAccAprAddChangeModeGuard: CanActivateFn = (route) => {
  const mode = route.paramMap.get('mode');
  if (mode === FINES_ACC_APR_ADD_CHANGE_MODES.ADD || mode === FINES_ACC_APR_ADD_CHANGE_MODES.CHANGE) {
    return true;
  }

  return createUrlTreeFromSnapshot(route, ['../', FINES_ACC_APR_ROUTING_PATHS.children.manage]);
};
