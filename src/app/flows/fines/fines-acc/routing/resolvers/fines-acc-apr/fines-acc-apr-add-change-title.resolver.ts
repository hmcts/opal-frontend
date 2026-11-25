import { ResolveFn } from '@angular/router';
import { FINES_ACC_APR_ADD_CHANGE_TEXT } from '../../../fines-acc-apr-add-change/constants/fines-acc-apr-add-change-text.constant';
import { TFinesAccAprAddChangeMode } from '../../../fines-acc-apr-add-change/types/fines-acc-apr-add-change-mode.type';

export const finesAccAprAddChangeTitleResolver: ResolveFn<string> = (route) => {
  const mode = route.paramMap.get('mode') as TFinesAccAprAddChangeMode;
  return `OPAL - ${FINES_ACC_APR_ADD_CHANGE_TEXT[mode].headingText}`;
};
