import { IManualAccountCreationCompanyDetailsState } from '../interfaces';

export const MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK: IManualAccountCreationCompanyDetailsState = {
  CompanyName: 'Acme Org Ltd.',
  AddAlias: true,
  Aliases: [
    {
      AliasOrganisationName_0: 'Boring Co.',
    },
  ],
  AddressLine1: '123 Street',
  AddressLine2: 'City',
  AddressLine3: 'County',
  Postcode: 'AB12 3CD',
};
