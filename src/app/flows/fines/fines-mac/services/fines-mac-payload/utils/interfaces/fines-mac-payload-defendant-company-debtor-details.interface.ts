import { IFinesMacPayloadAccountDefendantCompanyDebtorDetailsAlias } from './fines-mac-payload-defendant-company-debtor-details-alias.interface';

export interface IFinesMacPayloadAccountDefendantCompanyDebtorDetails {
  document_language: string | null;
  hearing_language: string | null;
  aliases: IFinesMacPayloadAccountDefendantCompanyDebtorDetailsAlias[] | null;
}
