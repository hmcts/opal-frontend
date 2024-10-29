import { IFinesMacPayloadDefendantCompanyDebtorDetailsAlias } from './fines-mac-payload-defendant-company-debtor-details-alias.interface';

export interface IFinesMacPayloadDefendantCompanyDebtorDetails {
  document_language: string | null;
  hearing_language: string | null;
  aliases: IFinesMacPayloadDefendantCompanyDebtorDetailsAlias[] | null;
}
