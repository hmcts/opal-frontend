import { IOpalFinesAprPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr-payload.interface';
import { IFinesAccAprAddFormState } from '../../fines-acc-apr-add/interfaces/fines-acc-apr-add-form-state.interface';

export function buildAprPayload(formState: IFinesAccAprAddFormState): IOpalFinesAprPayload {
  return { apr_text: formState.apr_text };
}
