import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from './fines-acc-party-add-amend-convert-party-types.constant';

type FinesAccPartyAddAmendConvertPartyType =
  (typeof FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES)[keyof typeof FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES];

interface IFinesAccPartyAddAmendConvertText {
  confirmationHeading: string;
  convertActionLabel: string;
  successMessage: string;
  warningText: string;
}

export const FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT: Record<
  FinesAccPartyAddAmendConvertPartyType,
  IFinesAccPartyAddAmendConvertText
> = {
  [FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY]: {
    confirmationHeading: 'Are you sure you want to convert this account to a company account?',
    convertActionLabel: 'Convert to a company account',
    successMessage: 'Converted to a company account.',
    warningText: 'Certain data related to individual accounts, such as employment details, will be removed.',
  },
  [FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL]: {
    confirmationHeading: 'Are you sure you want to convert this account to an individual account?',
    convertActionLabel: 'Convert to an individual account',
    successMessage: 'Converted to an individual account.',
    warningText: 'Some information specific to company accounts, such as company name, will be removed.',
  },
};