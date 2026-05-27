import { IOpalFinesAccountMinorCreditorCreditor } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { IFinesAccMinorCreditorAddAmendConvertState } from '../../fines-acc-minor-creditor-add-amend-convert/interfaces/fines-acc-minor-creditor-add-amend-convert-state.interface';

const mapSortCodeForEdit = (sortCode: string | null | undefined): string | null => {
  return sortCode ? sortCode.replace(/\D/g, '') : null;
};

const mapBacsFields = (data: IOpalFinesAccountMinorCreditorCreditor) => {
  const { payment } = data;
  const hasBacsDetails = payment.pay_by_bacs === true;

  return {
    facc_minor_creditor_pay_by_bacs: hasBacsDetails,
    facc_minor_creditor_bank_account_name: hasBacsDetails ? payment.account_name || null : null,
    facc_minor_creditor_bank_sort_code: hasBacsDetails ? mapSortCodeForEdit(payment.sort_code) : null,
    facc_minor_creditor_bank_account_number: hasBacsDetails ? payment.account_number || null : null,
    facc_minor_creditor_bank_account_reference: hasBacsDetails ? payment.account_reference || null : null,
  };
};

/**
 * Transforms minor creditor account creditor-tab data from the API into the amend form state.
 *
 * @param data - The minor creditor creditor-tab data from the API
 * @returns The transformed form state object for the minor creditor amend form
 */
export const transformMinorCreditorAccountPayload = (
  data: IOpalFinesAccountMinorCreditorCreditor,
): IFinesAccMinorCreditorAddAmendConvertState => {
  const { party_details: partyDetails, address } = data;
  const individualDetails = partyDetails.individual_details;
  const organisationDetails = partyDetails.organisation_details;
  const isCompany = partyDetails.organisation_flag === true;

  return {
    facc_minor_creditor_creditor_type: isCompany ? 'company' : 'individual',
    facc_minor_creditor_title: !isCompany ? individualDetails?.title || null : null,
    facc_minor_creditor_forenames: !isCompany ? individualDetails?.forenames || null : null,
    facc_minor_creditor_surname: !isCompany ? individualDetails?.surname?.toUpperCase() || null : null,
    facc_minor_creditor_company_name: isCompany ? organisationDetails?.organisation_name || null : null,
    facc_minor_creditor_address_line_1: address.address_line_1 || null,
    facc_minor_creditor_address_line_2: address.address_line_2 || null,
    facc_minor_creditor_address_line_3: address.address_line_3 || null,
    facc_minor_creditor_address_line_4: address.address_line_4 || null,
    facc_minor_creditor_address_line_5: address.address_line_5 || null,
    facc_minor_creditor_post_code: address.postcode?.toUpperCase() || null,
    ...mapBacsFields(data),
  };
};
