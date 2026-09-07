import { IOpalFinesDraftAccountPatchPayload } from '../interfaces/opal-fines-draft-account.interface';

export type IOpalFinesDraftAccountPatchRequestPayload = Omit<
  IOpalFinesDraftAccountPatchPayload,
  'timeline_data' | 'validated_by' | 'validated_by_name'
>;
