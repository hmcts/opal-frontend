import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

export interface IFinesConSearchResultDefendantAccount extends IOpalFinesDefendantAccount {
  collection_order?: boolean | null;
  last_enforcement?: string | null;
  has_paying_parent_guardian?: boolean | null;
  checks?: {
    errors?: Array<{ reference?: string; message?: string }>;
    warnings?: Array<{ reference?: string; message?: string }>;
  } | null;
}
