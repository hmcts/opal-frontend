import { IFinesMacCompanyDetailsAlias } from './fines-mac-company-details-alias.interface';

export interface IFinesMacCompanyDetailsState {
  companyName: string | null;
  addAlias: boolean | null;
  aliases: IFinesMacCompanyDetailsAlias[];
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
}
