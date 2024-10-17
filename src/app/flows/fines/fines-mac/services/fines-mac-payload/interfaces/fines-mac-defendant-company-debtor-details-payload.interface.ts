import { IFinesMacDefendantCompanyDebtorDetailsAliasPayload } from './fines-mac-defendant-company-debtor-details-alias-payload.interface';

export interface IFinesMacDefendantCompanyDebtorDetailsPayload {
  document_language: string | null;
  hearing_language: string | null;
  aliases: IFinesMacDefendantCompanyDebtorDetailsAliasPayload[] | null;
}
