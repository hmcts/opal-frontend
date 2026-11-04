import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

export type FinesMciCriminalAccountId = string | number;

export interface IFinesMciCriminalAccount extends Omit<
  IOpalFinesDefendantAccount,
  'defendant_account_id' | 'organisation_flag'
> {
  defendant_account_id: FinesMciCriminalAccountId | null;
  organisation?: boolean | null;
  organisation_flag?: boolean | null;
  has_collection_order?: boolean | null;
}
