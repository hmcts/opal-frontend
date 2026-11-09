import { IOpalFinesAprPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr-payload.interface';
import { IFinesAccAprAddChangeFormState } from '../../fines-acc-apr-add-change/interfaces/fines-acc-apr-add-change-form-state.interface';

/**
 * Creates the API payload shared by APR Add and Change requests.
 *
 * @param formState - The validated form state containing the attempted payment reference.
 * @returns The payment reference text with its case and characters preserved.
 */
export function buildAprPayload(formState: IFinesAccAprAddChangeFormState): IOpalFinesAprPayload {
  return { apr_text: formState.apr_text };
}
