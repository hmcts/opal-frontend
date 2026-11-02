import { IOpalFinesAprPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr-payload.interface';
import { IFinesAccAprAddChangeFormState } from '../../fines-acc-apr-add-change/interfaces/fines-acc-apr-add-change-form-state.interface';

export function buildAprPayload(formState: IFinesAccAprAddChangeFormState): IOpalFinesAprPayload {
  return { apr_text: formState.apr_text };
}
