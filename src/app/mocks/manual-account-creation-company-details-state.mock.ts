import { IManualAccountCreationCompanyDetailsState } from '../interfaces';

export const MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK: IManualAccountCreationCompanyDetailsState = {
  companyName: 'Acme Org Ltd.',
  addAlias: true,
  aliases: [
    {
      companyName_0: 'Boring Co.',
    },
  ],
  addressLine1: '123 Street',
  addressLine2: 'City',
  addressLine3: 'County',
  postcode: 'AB12 3CD',
};
